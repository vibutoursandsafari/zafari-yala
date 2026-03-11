export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-400">
          {new Date().getFullYear()} Zafari Yala. All rights reserved.
        </p>
      </div>
    </footer>
  );
}