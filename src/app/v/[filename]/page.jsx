// src/app/v/[filename]/page.jsx

export const metadata = ({ params }) => {
  // Si no existen params o no tiene filename, usamos un valor por defecto
  const filename = params?.filename || 'default-video.mp4';
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${filename}`;
  const thumbnailUrl =
    'https://via.placeholder.com/640x360.png?text=Video+Thumbnail';

  return {
    title: `Video: ${filename}`,
    description: 'Watch this video recorded for you.',
    openGraph: {
      title: `Video for you: ${filename}`,
      description: 'Watch this video recorded for you.',
      images: [
        {
          url: thumbnailUrl,
          width: 640,
          height: 360,
          alt: 'Thumbnail del video',
        },
      ],
      video: {
        url: videoUrl,
        type: 'video/mp4',
        width: 640,
        height: 360,
      },
    },
  };
};

export default function VideoPage({ params }) {
  const { filename } = params || { filename: 'default-video.mp4' };
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${filename}`;

  return (
    <main style={{ padding: '1rem', textAlign: 'center' }}>
      {/* <h1>Video: {filename}</h1> */}
      <h1 className="text-2xl text-white font-semibold">
        <span className="bg-teal-800 px-3 py-2 rounded-full">Your Video</span>
      </h1>
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <video
          src={videoUrl}
          controls
          width="640"
          height="360"
          style={{ maxWidth: '100%' }}
          className="rounded-lg border p-5 border-teal-900 shadow-lg shadow-teal-900"
        >
          Your browser dont support the video.
        </video>
      </div>
    </main>
  );
}
