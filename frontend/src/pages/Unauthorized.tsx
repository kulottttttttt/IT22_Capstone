import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
