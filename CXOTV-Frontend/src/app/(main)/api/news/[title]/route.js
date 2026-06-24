import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { title } = params;

    try {
        // Replace with your actual data fetching logic from your backend
        const response = await fetch(`${process.env.API_URL}/api/news?filters[slug]=${title}&populate=*`);

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const data = await response.json();

        return NextResponse.json(data.data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}