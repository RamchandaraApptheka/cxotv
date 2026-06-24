import Link from 'next/link';


const Error = () => {
    return (
        <div>

            <div
                className="flex items-center justify-center my-10"
                style={{
                    backgroundImage: 'url(/assets/page2logo.jpg)',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    minHeight: '400px' // Added for better display
                }}
            >
                <p className="lg:text-[68px] text-white font-fira capitalize">
                    404 Error
                </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 px-4 py-8">
                <div className="text-red-600 font-roboto text-4xl font-bold text-center">
                    Oops! Page Not Found
                </div>
                <p className="text-gray-700 text-lg text-center max-w-2xl">
                    Sorry, We couldn’t find the page you’re looking for. Maybe try one of the links in the navigation.
                </p>
                <Link
                    href="/"
                    className="py-2 px-4 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 transition-colors duration-200"
                >
                    Back to Home Page
                </Link>
            </div>
        </div>
    );
};

export default Error;