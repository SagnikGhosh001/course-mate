export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { username, name, email, password } = body;

    if (!username || !name || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Please fill all fields",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    
  } catch (error) {}
}
