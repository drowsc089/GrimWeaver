using System.Net;
using System.Net.Sockets;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;

internal static class Program
{
    private static HttpListener? listener;
    private static NotifyIcon? tray;
    private static string root = "";
    private static readonly ConcurrentDictionary<string, string> videos = new();
    private static readonly List<HttpListener> aliases = new();
    private static readonly SemaphoreSlim preferenceLock = new(1, 1);
    private static string preferencePath = "";

    [STAThread]
    private static void Main(string[] args)
    {
        ApplicationConfiguration.Initialize();
        preferencePath = args.Contains("--test") && Environment.GetEnvironmentVariable("GRIMWEAVER_TEST_PREFERENCES") is string testPath && Path.IsPathFullyQualified(testPath)
            ? testPath : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "GrimWeaver", "preferences.json");
        root = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "app"));
        if (!File.Exists(Path.Combine(root, "index.html")))
        {
            MessageBox.Show("缺少应用文件 / Application files are missing.", "GrimWeaver");
            return;
        }
        const int port = 15688;
        var url = $"http://127.0.0.1:{port}/";
        listener = new HttpListener();
        listener.Prefixes.Add(url);
        try { listener.Start(); }
        catch (Exception error)
        {
            try
            {
                using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
                var response = client.GetAsync(url).GetAwaiter().GetResult();
                if (response.Headers.TryGetValues("X-DawnBuild-Version", out var values) && values.Contains("1.82"))
                {
                    if (!args.Contains("--test")) Open(url);
                    return;
                }
            }
            catch { }
            MessageBox.Show("本地端口15688被其他程序占用 / Local port 15688 is occupied.\n" + error.Message, "GrimWeaver");
            return;
        }
        var menu = new ContextMenuStrip();
        menu.Items.Add("打开 / Open", null, (_, _) => Open(url));
        menu.Items.Add("退出 / Exit", null, (_, _) => Application.Exit());
        var iconPath = Path.Combine(root, "assets", "brand", "GrimWeaver.ico");
        tray = new NotifyIcon { Icon = File.Exists(iconPath) ? new Icon(iconPath) : SystemIcons.Application, Text = "GrimWeaver | GAL v97d", Visible = true, ContextMenuStrip = menu };
        tray.DoubleClick += (_, _) => Open(url);
        Application.ApplicationExit += (_, _) => { listener.Stop(); foreach (var alias in aliases) alias.Close(); tray.Dispose(); };
        _ = Serve();
        foreach (var legacyPort in Enumerable.Range(15681, 7))
        {
            var alias = new HttpListener(); alias.Prefixes.Add($"http://127.0.0.1:{legacyPort}/");
            try { alias.Start(); aliases.Add(alias); _ = RedirectLegacy(alias, url); } catch { alias.Close(); }
        }
        if (args.Contains("--test"))
        {
            Directory.CreateDirectory(Path.Combine(AppContext.BaseDirectory, "verification"));
            File.WriteAllText(Path.Combine(AppContext.BaseDirectory, "verification", "launcher-url.txt"), url, Encoding.UTF8);
        }
        else Open(url);
        Application.Run();
    }

    private static void Open(string url)
    {
        var edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe");
        if (File.Exists(edge))
        {
            var info = new ProcessStartInfo(edge) { UseShellExecute = false };
            info.ArgumentList.Add("--app=" + url);
            Process.Start(info);
        }
        else Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }

    private static async Task Serve()
    {
        while (listener?.IsListening == true)
        {
            HttpListenerContext context;
            try { context = await listener.GetContextAsync(); }
            catch { break; }
            _ = Handle(context);
        }
    }

    private static async Task Handle(HttpListenerContext context)
    {
        try
        {
            var relative = Uri.UnescapeDataString(context.Request.Url?.AbsolutePath ?? "/").TrimStart('/');
            if (relative == "api/preferences") { await Preferences(context); return; }
            if (relative == "api/video" && context.Request.HttpMethod == "POST") { await AllowVideo(context); return; }
            if (context.Request.HttpMethod != "GET") { context.Response.StatusCode = 405; return; }
            if (relative.StartsWith("api/video/")) { await SendVideo(context, relative[10..]); return; }
            if (relative.Length == 0) relative = "index.html";
            if (relative == "lucide.min.js")
            {
                await SendFile(context, Path.Combine(AppContext.BaseDirectory, "lucide.min.js"));
                return;
            }
            if (relative.StartsWith("docs/", StringComparison.Ordinal))
            {
                var docs = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "docs"));
                var document = Path.GetFullPath(Path.Combine(docs, relative[5..]));
                if (!document.StartsWith(docs + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase)) { context.Response.StatusCode = 403; return; }
                await SendFile(context, document); return;
            }
            var file = Path.GetFullPath(Path.Combine(root, relative.Replace('/', Path.DirectorySeparatorChar)));
            if (!file.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase)) { context.Response.StatusCode = 403; return; }
            await SendFile(context, file);
        }
        catch { context.Response.StatusCode = 500; }
        finally { context.Response.Close(); }
    }

    private static async Task SendFile(HttpListenerContext context, string file)
    {
        if (!File.Exists(file)) { context.Response.StatusCode = 404; return; }
        context.Response.ContentType = Path.GetExtension(file).ToLowerInvariant() switch { ".js" => "text/javascript; charset=utf-8", ".css" => "text/css; charset=utf-8", ".png" => "image/png", ".svg" => "image/svg+xml", ".ico" => "image/x-icon", ".txt" => "text/plain; charset=utf-8", ".json" => "application/json", _ => "text/html; charset=utf-8" };
        context.Response.Headers["Cache-Control"] = "no-cache";
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["X-DawnBuild-Version"] = "1.82";
        context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; frame-src 'none'";
        await using var input = File.OpenRead(file);
        context.Response.ContentLength64 = input.Length;
        await input.CopyToAsync(context.Response.OutputStream);
    }

    private static async Task RedirectLegacy(HttpListener alias, string target)
    {
        while (alias.IsListening) try { var c = await alias.GetContextAsync(); c.Response.Redirect(target + c.Request.Url!.PathAndQuery.TrimStart('/')); c.Response.Close(); } catch { break; }
    }

    private static async Task Preferences(HttpListenerContext c)
    {
        string? language = null;
        if (c.Request.HttpMethod == "POST")
        {
            if (c.Request.Headers["X-GrimWeaver-Action"] != "preferences" || c.Request.Headers["Origin"] != "http://127.0.0.1:15688" || c.Request.ContentLength64 is < 1 or > 512) { c.Response.StatusCode = 403; return; }
            try
            {
                using var json = await JsonDocument.ParseAsync(c.Request.InputStream);
                if (json.RootElement.ValueKind != JsonValueKind.Object || json.RootElement.EnumerateObject().Count() != 1 || !json.RootElement.TryGetProperty("language", out var value) || value.ValueKind != JsonValueKind.String || value.GetString() is not ("zh" or "en")) { c.Response.StatusCode = 400; return; }
                language = value.GetString();
            }
            catch (JsonException) { c.Response.StatusCode = 400; return; }
        }
        else if (c.Request.HttpMethod != "GET") { c.Response.StatusCode = 405; return; }
        await preferenceLock.WaitAsync();
        try
        {
            if (language != null)
            {
                Directory.CreateDirectory(Path.GetDirectoryName(preferencePath)!);
                var temp = preferencePath + ".tmp";
                await File.WriteAllTextAsync(temp, JsonSerializer.Serialize(new { language }), new UTF8Encoding(false));
                File.Move(temp, preferencePath, true);
            }
            else if (File.Exists(preferencePath) && new FileInfo(preferencePath).Length <= 1024)
            {
                try { using var json = JsonDocument.Parse(await File.ReadAllTextAsync(preferencePath)); if (json.RootElement.ValueKind == JsonValueKind.Object && json.RootElement.TryGetProperty("language", out var value) && value.ValueKind == JsonValueKind.String && value.GetString() is "zh" or "en") language = value.GetString(); }
                catch (JsonException) { }
            }
        }
        finally { preferenceLock.Release(); }
        c.Response.ContentType = "application/json; charset=utf-8";
        c.Response.Headers["Cache-Control"] = "no-store";
        c.Response.Headers["X-Content-Type-Options"] = "nosniff";
        await c.Response.OutputStream.WriteAsync(JsonSerializer.SerializeToUtf8Bytes(new { language }));
    }

    private static async Task AllowVideo(HttpListenerContext c)
    {
        var origin = c.Request.Headers["Origin"];
        if (c.Request.Headers["X-GrimWeaver-Action"] != "local-video" || origin != "http://127.0.0.1:15688" || c.Request.ContentLength64 is < 0 or > 16384) { c.Response.StatusCode = 403; return; }
        using var reader = new StreamReader(c.Request.InputStream, Encoding.UTF8);
        using var json = JsonDocument.Parse(await reader.ReadToEndAsync());
        var file = json.RootElement.GetProperty("path").GetString() ?? "";
        if (!Regex.IsMatch(file, @"^[A-Za-z]:[\\/]") || file.IndexOf(':', 2) >= 0 || !new[] { ".mp4", ".webm", ".mkv", ".mov", ".avi", ".m4v" }.Contains(Path.GetExtension(file).ToLowerInvariant()) || !File.Exists(file)) { c.Response.StatusCode = 400; return; }
        if (videos.Count >= 8) videos.Clear();
        var token = Guid.NewGuid().ToString("N"); videos[token] = Path.GetFullPath(file);
        c.Response.ContentType = "application/json"; c.Response.Headers["Cache-Control"] = "no-store";
        await c.Response.OutputStream.WriteAsync(JsonSerializer.SerializeToUtf8Bytes(new { url = "/api/video/" + token }));
    }

    private static async Task SendVideo(HttpListenerContext c, string token)
    {
        if (!videos.TryGetValue(token, out var file)) { c.Response.StatusCode = 404; return; }
        await using var input = File.OpenRead(file); long start = 0, end = input.Length - 1;
        var range = c.Request.Headers["Range"];
        if (range != null)
        {
            var match = Regex.Match(range, @"^bytes=(\d+)-(\d*)$");
            if (!match.Success || !long.TryParse(match.Groups[1].Value, out start) || match.Groups[2].Value.Length > 0 && !long.TryParse(match.Groups[2].Value, out end) || start < 0 || start >= input.Length || end < start) { c.Response.StatusCode = 416; c.Response.Headers["Content-Range"] = $"bytes */{input.Length}"; return; }
            end = Math.Min(end, input.Length - 1); c.Response.StatusCode = 206; c.Response.Headers["Content-Range"] = $"bytes {start}-{end}/{input.Length}";
        }
        c.Response.ContentType = Path.GetExtension(file).ToLowerInvariant() == ".webm" ? "video/webm" : "video/mp4";
        c.Response.Headers["Accept-Ranges"] = "bytes"; c.Response.Headers["Cache-Control"] = "no-store"; c.Response.ContentLength64 = end - start + 1; input.Position = start;
        var buffer = new byte[65536]; var left = end - start + 1;
        while (left > 0) { var n = await input.ReadAsync(buffer.AsMemory(0, (int)Math.Min(buffer.Length, left))); if (n == 0) break; await c.Response.OutputStream.WriteAsync(buffer.AsMemory(0, n)); left -= n; }
    }
}
