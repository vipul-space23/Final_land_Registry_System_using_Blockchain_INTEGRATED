import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react'; // A nice icon to indicate email notification

const PendingVerificationPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full text-center bg-white p-10 rounded-xl shadow-lg">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100">
                    <MailCheck className="h-12 w-12 text-indigo-600" aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Application Submitted!
                </h2>
                <div className="mt-4">
                    <p className="text-md text-gray-600">
                        Thank you for registering. Your account is now pending verification.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Your document will be reviewed by the Land Inspector. This process usually takes 24–36 business hours.
                    </p>
                </div>
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800">What's Next?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        You will receive an email notification at the address you provided as soon as your account is approved. After receiving the confirmation email, you will be able to log in.
                    </p>
                </div>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PendingVerificationPage;