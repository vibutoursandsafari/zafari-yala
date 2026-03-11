import Image from 'next/image';
import { FiClock, FiUser, FiCalendar } from 'react-icons/fi';

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdDate: string;
  readingTime?: number;
}

export default function ArticlesCard({
  title,
  content,
  image,
  author,
  createdDate,
  readingTime,
}: ArticleCardProps) {
  // Calculate reading time (100 words = 1 min)
  const calculateReadingTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 100);
    return Math.max(1, minutes);
  };

  const estimatedReadingTime = readingTime || calculateReadingTime(content);
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm transform transition duration-300 border border-gray-100 flex flex-col h-full hover:shadow-md hover:-translate-y-1 hover:cursor-pointer">
      {/* Fixed Size Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/*Date and mins read */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-600" />
            <time>
              {new Date(createdDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="text-gray-600" />
            <span>{estimatedReadingTime} Mins Read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-emerald-800 transition-colors">
          {title}
        </h3>

        {/* Content */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {content}
        </p>

        {/* Metadata Footer */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-500">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                <FiUser size={14} />
              </div>
              <span className="font-bold text-gray-700 truncate max-w-[120px]">
                {author}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}