using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly string apiKey = ""
    // "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";

    [HttpPost]
    public async Task<IActionResult> GetChatResponse([FromBody] ChatRequest request)
    {
        if (request.Messages == null || request.Messages.Length == 0)
        {
            return BadRequest(new { error = "Messages array cannot be empty." });
        }

        var client = new RestClient("https://api.openai.com/v1/chat/completions");
        var chatRequest = new RestRequest()
            .AddHeader("Authorization", $"Bearer {apiKey}")
            .AddHeader("Content-Type", "application/json")
            .AddJsonBody(new
            {
                model = "gpt-4o-mini",
                messages = request.Messages
            });

        var response = await client.PostAsync(chatRequest);

        if (!response.IsSuccessful)
        {
            return StatusCode((int)response.StatusCode, new { error = response.Content });
        }

        var responseBody = JsonSerializer.Deserialize<JsonElement>(response.Content);
        var reply = responseBody.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

        return Ok(new { reply });
    }
}

public class ChatRequest
{
    public ChatMessage[] Messages { get; set; }
}

public class ChatMessage
{
    public string Role { get; set; }
    public string Content { get; set; }
}
