export default function chunkArray(array, chunks) {

  const chunk_array = array
    .map((_,i) => (i % chunks == 0) && array.slice(i,i+chunks))
    .filter(e => e);

  return chunk_array;
};