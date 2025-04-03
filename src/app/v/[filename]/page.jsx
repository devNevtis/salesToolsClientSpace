// src/app/v/[filename]/page.jsx

export const metadata = ({ params }) => {
  // Si no existen params o no tiene filename, usamos un valor por defecto
  const filename = params?.filename || 'default-video.mp4';
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${filename}`;
  const thumbnailUrl =
    'https://via.placeholder.com/640x360.png?text=Video+Thumbnail';

  return {
    title: `Video: ${filename}`,
    description: 'Mira este video grabado desde mi app.',
    openGraph: {
      title: `Video de mi app: ${filename}`,
      description: 'Mira este video grabado desde mi app.',
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
      <h1 className="text-2xl">Your Video</h1>
      <div className="flex flex-col items-center justify-center gap-6 p-6">
        <video
          src={videoUrl}
          controls
          width="640"
          height="360"
          style={{ maxWidth: '100%' }}
          className="rounded-lg border p-4 border-gray-300 shadow-lg"
        >
          Tu navegador no soporta el elemento video.
        </video>
      </div>
    </main>
  );
}
