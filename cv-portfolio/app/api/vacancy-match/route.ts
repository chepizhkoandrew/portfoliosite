import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vacancy } = body

    if (!vacancy || typeof vacancy !== 'string') {
      return NextResponse.json(
        { error: 'Vacancy description is required' },
        { status: 400 }
      )
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const response = await fetch(`${BACKEND_URL}/api/vacancy-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vacancy: vacancy.trim(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend error ${response.status}:`, errorText)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Vacancy match error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze vacancy. Make sure the backend is running.' },
      { status: 500 }
    )
  }
}
