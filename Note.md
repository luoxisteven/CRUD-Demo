## .NET

### Dependency Injection - Service Class
| Lifetime    | Instance Creation        | Scope               | Best For                                 |
|-------------|--------------------------|---------------------|------------------------------------------|
| Singleton   | Once per application     | Entire application  | Stateless, shared resources, caching     |
| Scoped      | Once per HTTP request    | Current HTTP request| Per-request state, DbContext             |
| Transient   | Every time requested     | Only when used      | Lightweight, stateless services          |
| Hosted      | Once at application start| Runs independently  | Background processing                    |

### async Task<...>
- Task 是 C# 中的异步编程类型，它是 System.Threading.Tasks 命名空间中的类，用于表示异步操作。当您看到 `async Task<...>` 时，它表示这是一个异步方法，会返回一个 Task 对象，该对象代表了异步操作的结果。
- Task is an asynchronous programming type in C#, which is a class in the System.Threading.Tasks namespace used to represent asynchronous operations. When you see `async Task<...>`, it indicates this is an asynchronous method that will return a Task object, which represents the result of the asynchronous operation.


### IActionResult
- IActionResult 是一个接口，代表所有可能的 HTTP 响应类型。它允许控制器方法返回各种 HTTP 状态码和响应内容，而不限定具体的返回数据类型。使用 IActionResult 时，您可以返回：
- IActionResult: IActionResult is an interface that defines a generic HTTP response. It allows developers to flexibly return different types of HTTP responses from web API methods or controllers. Unlike ActionResult, it does not explicitly specify the response type, leaving it up to the developer to determine the appropriate response type for each scenario. For instance, OkResult, BadRequestResult, NotFoundResult, and others are all implementations of IActionResult used to return specific HTTP status codes.
``` csharp
// Example using IActionResult  
public IActionResult Get()  
{  
    if (someCondition)  
    {  
        return Ok(resultData);  
    }  
    else if (anotherCondition)  
    {  
        return NotFound();  
    }  
    else  
    {  
        return BadRequest("Invalid request");  
    }  
}
```
### ActionResult
- ActionResult: On the other hand, ActionResult is a concrete implementation of IActionResult. It is employed to explicitly specify the type of response to be returned, making the code more concise and self-explanatory. This is particularly useful when you want to return a specific data type along with an HTTP status code.
``` csharp
// Example using ActionResult<T>  
public ActionResult<List<SomeData>> Get()  
{  
    if (someCondition)  
    {  
        return Ok(resultData);  
    }  
    else if (anotherCondition)  
    {  
        return NotFound();  
    }  
    else  
    {  
        return BadRequest("Invalid request");  
    }  
}
```

### IActionResult v.s. ActionResult
- `IActionResult` is more suitable for scenarios where a method may `return various response` types depending on different conditions.
- `ActionResult` is preferred when you want to `clearly specify both the data type and the HTTP status code` to be returned.