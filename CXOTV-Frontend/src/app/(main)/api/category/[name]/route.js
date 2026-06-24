import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { name } = params;

    try {
        // Replace with your actual data fetching logic
        const response = await fetch(
            `${process.env.API_URL}/api/articles?filters[categories][name][$eq]=${name}&populate=*`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch category news');
        }

        const data = await response.json();

        return NextResponse.json({ data: data.data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}