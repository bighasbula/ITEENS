# Judge0 Setup Guide

## Getting Started with Judge0

To enable code execution in ARENA, you need to set up Judge0 API integration.

### 1. Self-Hosted Judge0 Service

This project uses a self-hosted Judge0 service deployed on Railway:
- **Service URL**: `https://worker-production-347a.up.railway.app`
- **No API key required** - direct access to the service

### 2. Environment Setup

No environment variables are required for Judge0 integration since we're using a self-hosted service.

### 3. Supported Languages

The platform currently supports:
- **Python** (3.8.1)
- **JavaScript** (Node.js 12.14.0)
- **Java** (OpenJDK 13.0.1)
- **C++** (GCC 9.2.0)

### 4. How It Works

1. **Run Code**: Executes your code with the first test case
2. **Submit Code**: Runs all test cases and shows detailed results
3. **Real-time Feedback**: Shows execution time, memory usage, and errors

### 5. Test Cases

The Two Sum problem includes 5 test cases:
- Example cases from the problem description
- Additional edge cases
- Zero target case

### 6. Code Templates

Each language has a pre-configured template that:
- Reads input from stdin
- Calls the solution function
- Prints the result in the expected format

### 7. Error Handling

The system handles:
- Compilation errors
- Runtime errors
- Timeout errors
- Memory limit exceeded

### 8. Rate Limits

Self-hosted Judge0 service has no external rate limits, but consider:
- Server resource limitations
- Concurrent execution limits
- Memory and CPU constraints

Monitor your Railway service usage for optimal performance.
