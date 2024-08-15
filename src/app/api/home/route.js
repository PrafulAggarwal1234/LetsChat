export async function GET(request) {
    // Handle GET request
    return new Response(JSON.stringify({ message: 'Hello, World!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
export async function POST(request) {
const data = await request.json();
const { name } = data;

// Handle POST request
return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
    status: 200,
    headers: {
    'Content-Type': 'application/json',
    },
});
}
  