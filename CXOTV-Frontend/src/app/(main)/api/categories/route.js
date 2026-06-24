import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Replace with your actual data fetching logic
        const response = await fetch(`${process.env.API_URL}/api/categories?populate=subcategories`);

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();

        return NextResponse.json({ categories: data.data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}