export default function ShimmerCard() {
  return (
    <div className='w-full h-[160px] md:h-[200px] bg-gray-200 rounded-xl animate-pulse relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer' />
    </div>
  );
}
