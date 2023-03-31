import axios from 'axios';

export default async function requestImg(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '34923417-02c79b4e71700a573ffcadca8';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

    return await axios.get(`${url}${filter}`).then(response => response.data);
}
