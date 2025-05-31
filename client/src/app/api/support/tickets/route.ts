import { NextResponse } from 'next/server'
import { z } from 'zod'

const supportTicketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().min(1, 'Category is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body) // Log the request body

    const validatedData = supportTicketSchema.parse(body)
    console.log('Validated data:', validatedData) // Log the validated data

    const response = await fetch('http://localhost:5000/api/support/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    console.log('Backend response status:', response.status) // Log the response status
    const data = await response.json()
    console.log('Backend response data:', data) // Log the response data

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create support ticket')
    }

    // Enhance the response with additional fields
    const enhancedResponse = {
      success: true,
      message: "Support ticket created successfully",
      data: {
        ...data.data,
        name: validatedData.name,
        email: validatedData.email,
        priority: validatedData.priority,
        category: validatedData.category
      }
    }

    return NextResponse.json(enhancedResponse)
  } catch (error) {
    console.error('Error in API route:', error) // Log any errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/support/tickets')
    console.log('GET tickets response status:', response.status) // Log the response status
    
    if (!response.ok) {
      throw new Error('Failed to fetch support tickets')
    }

    const data = await response.json()
    console.log('GET tickets response data:', data) // Log the response data
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tickets:', error) // Log any errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 