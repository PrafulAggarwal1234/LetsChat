import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"
    if (!token) {
    
      return NextResponse.redirect('http://localhost:3000/auth'); // Redirect unauthenticated users to the login page
    }
  
    try {
        
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const {payload}=await jwtVerify(token, secret);
      request.user = payload; // Attach the user to the request (though this won't persist to the actual handler)
      const response = NextResponse.next();
      response.headers.set('user',JSON.stringify(payload));
      return response; // Allow the request to proceed
    } catch (err) {
        //console.log(err)
      return new NextResponse("Token is not valid!", { status: 403 });
    }
  }
  
// Apply middleware to specific routes
export const config = {
matcher: ['/api/dashboard','/api/user','/api/chat/:path*','/api/message/:path*'],
};

