import axios from "axios";
import Cookies from "universal-cookie";
import convertArrayToString from "../../utils/convertArrayToString";
import getGenreId from "../../utils/getGenreId";
import interceptResponse from "../../utils/interceptResponse";
import { refresh_token } from "../constants/refreshToken";
import { sendLog } from "./account";
import { fetchChannelInfo } from "./channels";
import { onSearchQueryType } from "./slice/inputSlice";

import {
  fetchMovies_begin,
  fetchMovies_success,
  fetchMovies_error,
  fetchCategory_begin,
  fetchCategory_success,
  fetchCategory_error,
  fetchMovieDetails_begin,
  fetchMovieDetails_success,
  fetchMovieDetails_error,
  fetchMovieVideo_success,
  fetchMovieVideo_error,
  fetchMoviesByCategory,
  setGenreCategories,
  fetchBannerTrailer,
  fetchPackageMoviesReducer,
  fetchSimilarMoviesReducer,
  fetchOneSeriesReducer,
  fetchWatchlistReducer,
  fetchGenresReducer,
  fetchAgeRatingsReducer,
  fetchAllSeriesReducer
} from "./slice/moviesSlice";

// get user info from cookies
const cookies = new Cookies();
const user_info = cookies.get("user_info");

export const fetchOneSeries = async (seriesId, dispatch) => {
  try {
    const { access_token, operator_uid } = user_info.data.data

    interceptResponse()

    let req = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/series/${seriesId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    dispatch(fetchOneSeriesReducer(req.data.data))

  } catch (e) {
    console.error(e.message)
  }
}

export const fetchSimilarMovies = async (type, movieId, dispatch) => {
  try {
    const { access_token, operator_uid } = user_info.data.data

    interceptResponse()

    let req = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/vod/${type}/${movieId}/related`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    dispatch(fetchSimilarMoviesReducer(req.data.data))

  } catch (e) {
    console.error(e.message)
  }
}

export const fetchMovieByGenre = async (activeGenre, dispatch) => {
  try {
    const { access_token, operator_uid, user_id } = user_info.data.data;
    const packageIds = [];
    const _categoriesArray = []
    const activeGenreId = getGenreId(activeGenre);

    interceptResponse()

    const packages = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    [...packages.data.data].forEach((item) => {
      return packageIds.push(item.id);
    });

    const packagesString = packageIds.join(',')

    const categories = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v3/${operator_uid}/categories/vod?packages=${packagesString}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const _categories = categories.data.data

    dispatch(setGenreCategories(_categories))

    for (let i = 0; i < _categories.length; i++) {
      const element = _categories[i];
      _categoriesArray.push(element.id)
    }

    const categoriesString = _categoriesArray.toString()

    const movies = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/categories/vod/content?packages=${packagesString}&categories=${categoriesString}&genres=${activeGenreId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    // switch (activeGenre) {
    // case 'DRAMA':
    //   dispatch(fetchMoviesByCategory({
    //     movies: movies.data.data,
    //     category: activeGenre
    //   }))
    //   return;

    // case 'ACTION':
    //   dispatch(fetchMoviesByCategory({
    //     movies: movies.data.data,
    //     category: activeGenre
    //   }))
    //   return;

    // case 'COMEDY':
    //   dispatch(fetchMoviesByCategory({
    //     movies: movies.data.data,
    //     category: activeGenre
    //   }))
    //   return;

    // case 'FAMILY':
    //   dispatch(fetchMoviesByCategory({
    //     movies: movies.data.data,
    //     category: activeGenre
    //   }))
    //   return;

    // default:
    //   dispatch(fetchMoviesByCategory({
    //     category: 'ALL',
    //     movies: [],
    //   }))
    //   break;
    // }

    // console.log(movies.data.data)

    if (activeGenre === "ALL") {
      dispatch(fetchMoviesByCategory({
        category: 'ALL',
        movies: [],
      }))
    } else dispatch(fetchMoviesByCategory({
      movies: movies.data.data,
      category: activeGenre
    }))
  }

  catch (e) {
    console.log(e.message)
  }
}

export const fetchTrailer = async (id) => {
  console.warn('fetch trailer', id)

  if (!id) return

  try {

    const { access_token, operator_uid, user_id } = user_info.data.data;

    interceptResponse()

    let url

    if (window.location.pathname === '/series') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/vod/trailers/series/${id}`
    else url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/vod/trailers/movies/${id}`

    const trailer = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    // dispatch(fetchBannerTrailer(trailer.data.data.url))

    console.warn('TRAILER URL: ', id, window.location.pathname, trailer.data.data.url)


    return trailer.data.data.url
  }

  catch (e) {
    console.error(e.message)
  }
}

export const getPackages = async () => {
  try {
    const { access_token, operator_uid, user_id } = user_info.data.data

    const packages = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    let packageIds = [];

    [...packages.data.data].forEach((item) => {
      return packageIds.push(item.id);
    });

    const packagesString = packageIds.join(',')

    return packagesString
  } catch (e) {
    console.error('get packages error', e.message``)
  }
}

export const fetchAllSeries = async (dispatch) => {
  try {

    const { access_token, operator_uid, user_id } = user_info.data.data

    const response = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/series?packages=${await getPackages()}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    const response_ = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/series?series_id=${convertArrayToString(response.data.data)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    // dispatch(fetchAllSeriesReducer(response_.data.data))

    return response_.data.data

  } catch (e) {
    console.warn('fetch all series error: ', e.message)
  }
}

export const fetchAllMovies = async () => {
  try {

    const { access_token, operator_uid } = user_info.data.data

    const response = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/movies`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    let vods = response.data.data || []

    const response_ = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v2/${operator_uid}/movies?movies=${convertArrayToString(vods)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    return response_.data.data

  } catch (e) {
    console.error('fetching all movies', e.message)
  }
}

export const fetchMovie = async (dispatch) => {
  // dispatch(fetchMovies_begin());

  try {
    const { access_token, operator_uid, user_id } = user_info.data.data;

    interceptResponse()

    const packages = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    // if (packages.data.status === "error") {
    //   dispatch(fetchMovies_error());
    //   return;
    // }

    // 2. call categories after packages is success
    if (packages.data.status === "ok") {

      let packageIds = [];

      [...packages.data.data].forEach((item) => {
        return packageIds.push(item.id);
      });

      const packagesString = packageIds.join(',')

      // fetch categories
      const categories = await axios.get(
        `https://ott.tvanywhereafrica.com:28182/api/client/v3/${operator_uid}/categories/vod?packages=${packagesString}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      // if (categories.data.status === "error") {
      //   // dispatch fail
      //   dispatch(fetchMovies_error());
      //   return;
      // }

      let _packageNameToId = {};

      categories.data.data.map((item) => {
        return (_packageNameToId[item.uid] = item.id);
      })

      console.log('_packageNameToId', _packageNameToId)

      let passInQuery = categories.data.data.map((item) => {
        return item.id;
      })

      if (categories.data.status === "ok") {
        const movies = await axios.get(
          `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/categories/vod/content?packages=${packagesString}&categories=${passInQuery}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        )

        const recentlyadded = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["recentlyadded"];
        });

        const mostwatched = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["mostwatched"];
        });

        const comingSoon = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["comingsoon"];
        });

        const trending = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["trending"];
        });

        const afriplaytop10 = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["afriplaytop10"];
        });

        const afriPlaylive = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["afriPlaylive"];
        });

        const afriPremiere = movies.data.data.filter((item) => {
          return item.id === _packageNameToId["AfriPremiere"];
        })

        dispatch(
          fetchMovies_success({
            movies: movies.data.data,
            packageNameToId: _packageNameToId,
            moviesByCategories: movies.data.data,
            mostwatched: mostwatched || [],
            recentlyadded: recentlyadded || [],
            comingSoon: comingSoon || [],
            trending: trending || [],
            afriplaytop10: afriplaytop10 || [],
            afriPlaylive: afriPlaylive || [],
            afriPremiere: afriPremiere || [],
          })
        );
      }
    }
  } catch (error) {
    // dispatch fail
    // dispatch(fetchMovies_error());
    console.log(error);
  }
};

export const fetchCategory = async (dispatch, id) => {
  dispatch(fetchCategory_begin());
  interceptResponse()

  const { access_token, operator_uid, user_id } = user_info.data.data;

  const packages = await axios.get(
    `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );
  if (packages.data.status === "error") {
    dispatch(fetchCategory_error());
    return;
  }

  // 2. call categories after packages is success

  if (packages.data.status === "ok") {
    // Get packages ids and add to category url params for movies fetch
    let packageIds = [];
    [...packages.data.data].forEach((item) => {
      return packageIds.push(item.id);
    });
    const packagesString = packageIds.join(',')

    // fetch categories
    const categories = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v3/${operator_uid}/categories/vod?packages=${packagesString}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );






    // 3. if categories in successfull call movies

    let _packageNameToId = {};
    categories.data.data.map((item) => {
      return (_packageNameToId[item.uid] = item.id);
    });
    let passInQuery = categories.data.data.map((item) => {
      return item.id;
    });

    if (categories.data.status === "ok") {
      const movies = await axios.get(
        `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/categories/vod/content?packages=${packageIds}&categories=${passInQuery}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      const category = movies.data.data.filter((item) => {
        return item.id === _packageNameToId[id];
      });

      refresh_token();
      dispatch(
        fetchCategory_success({
          category: category,
          moviesByCategories: movies.data.data,
          packageNameToId: _packageNameToId,
        })
      )
    }

    //       if (categories.data.status === "error") {
    //         // dispatch fail
    //         dispatch(fetchCategory_error());
    //         return;
    //       }
  }

  // export const fetchCategory = async (dispatch, id) => {
  //   dispatch(fetchCategory_begin());
  //   try {
  //     // 1. fetch packages and use the help of user cookies set in registration cookies
  //     const { access_token, operator_uid, user_id } = user_info.data.data;

  // const packages = await axios.get(
  //   `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${access_token}`
  //     }
  //   }
  // );

  // if (packages.data.status === "error") {
  //   // dispatch fail
  //   dispatch(fetchCategory_error());
  //   return;
  // }

  //     // console.log('packages -<',packages)

  //     // 2. call categories after packages is success
  //     if (packages.data.status === "ok") {
  //       // Get packages ids and add to category url params for movies fetch
  //       let packageIds = [];
  //       let getting_package_id = [...packages.data.data].forEach((item) => {
  //         return packageIds.push(item.id);
  //       });
  //       const packagesString = packageIds.join(',')

  //       console.log('packagesString -<', packagesString)
  //       // console.log('packageIds -<',packageIds)

  //       // fetch categories
  //       const categories = await axios.get(
  //         `https://ott.tvanywhereafrica.com:28182/api/client/v3/${operator_uid}/categories/vod?packages=${packagesString}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`
  //           }
  //         }
  //       );

  //       console.log('categories ->', categories.data.data)

  //       if (categories.data.status === "error") {
  //         // dispatch fail
  //         dispatch(fetchCategory_error());
  //         return;
  //       }

  //       // assigning ids to category name is successfull
  //       //   {
  //       //     "Drama": "7015",
  //       //     "Action": "7016",
  //       //     "Romance": "7017"
  //       // }

  //       let _packageNameToId = {};

  //       let nameToId = categories.data.data.map((item) => {
  //         return (_packageNameToId[item.uid] = item.id);
  //       });

  //       let passInQuery = categories.data.data.map((item) => {
  //         return item.id;
  //       });

  //       console.log('_packageNameToId -<', _packageNameToId)

  //       // 3. if categories in successfull call movies
  //       if (categories.data.status === "ok") {
  //         const movies = await axios.get(
  //           `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/categories/vod/content?packages=${packageIds}&categories=${passInQuery}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${access_token}`
  //             }
  //           }
  //         );
  //         // exmaple
  //         const category = movies.data.data.filter((item) => {
  //           return item.id === _packageNameToId[id];
  //         });

  //         // refresh_token
  //         refresh_token();
  //         // example
  //         // dispatch success
  //         dispatch(
  //           fetchCategory_success({
  //             category: category,
  //             packageNameToId: _packageNameToId
  //           })
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     // dispatch fail
  //     dispatch(fetchCategory_error());
  //     console.log(error);
  //   }
  // };
}

export const fetchMovieDetails = async (dispatch, movieId) => {

  dispatch(fetchMovieDetails_begin());

  try {
    const { access_token, user_id, operator_uid } = user_info.data.data;

    interceptResponse()

    const movie = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/movies/${movieId}`,
      // `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/movies/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (movie.data.status === "error") {
      dispatch(fetchMovieDetails_error());
      return;
    }

    if (movie.data.status === "ok") {
      dispatch(fetchMovieDetails_success(movie.data.data));
    }

    // console.log(movie);
  } catch (error) {
    console.log(error);
  }
};

export const fetchPackageMovies = async (movieId, dispatch) => {
  // dispatch(fetchMovieDetails_begin());

  try {
    const { access_token, operator_uid } = user_info.data.data;

    interceptResponse()

    const packagesMovies = await axios.get(`https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/packages`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    // if (packagesMovies.data.status === "error") {
    //   dispatch(fetchMovieDetails_error());
    //   return;
    // }

    if (packagesMovies.data.status === "ok") {
      dispatch(fetchPackageMoviesReducer(packagesMovies.data.data));
    }

    // console.log(movie);
  } catch (error) {
    console.log(error);
  }
}



export const fetchSeries = async (dispatch) => {

  try {

    const { access_token, operator_uid } = user_info.data.data;

    interceptResponse()

    const series = await axios.get(`https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/series`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    console.warn('series >>', series)

  } catch (error) {
    console.log(error);
  }
}

export const search = async (dispatch, keyword) => {

  try {

    const { access_token, operator_uid, user_id } = user_info.data.data;
    const formattedString = keyword.replace(/[^\w\s]/gi, '');

    interceptResponse()

    const packageIds = [];

    const packages = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    [...packages.data.data].forEach((item) => {
      return packageIds.push(item.id);
    });

    const packagesString = packageIds.join(',')

    const response = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/search/movies/${formattedString}?translation=hr&packages=${packagesString}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (response.data.status === "error") return;

    if (response.data.status === "ok") {
      dispatch(onSearchQueryType(
        {
          query: formattedString,
          response: response.data.data
        }
      ))
    }

    await sendLog({
      action: 'search',
      content_type: 'Movie',
      content_name: formattedString
    })

  } catch (error) {
    console.log(error)
  }
}

export const returnMovieDetails = async (movieId) => {

  try {
    const { access_token, operator_uid, user_id } = user_info.data.data;

    interceptResponse()

    const movie = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/movies/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (movie.data.status === "error") return;

    if (movie.data.status === "ok") return movie.data.data

  } catch (error) {
    console.log(error)
  }
}

export const fetchAgeRatings = async (dispatch) => {

  try {
    const { access_token, operator_uid } = user_info.data.data;

    interceptResponse()

    const response = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/age_ratings`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (response.data.status === "error") return;

    if (response.data.status === "ok") {
      let ageRatingsToId = [];

      response.data.data.map(item => {
        ageRatingsToId.push({ id: item.id, min_age: item.min_age })
      });

      dispatch(fetchAgeRatingsReducer(ageRatingsToId))
    }

  } catch (error) {
    console.log(error)
  }
}


export const returnMovieOrSeriesDetails = async (id, type) => {

  try {
    const { access_token, operator_uid, user_id } = user_info.data.data;

    interceptResponse()

    let url

    if (type === 'series') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/series/${id}`
    if (type === 'movie') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/movies/${id}`

    const movie = await axios.get(url,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (movie.data.status === "error") return;

    if (movie.data.status === "ok") return movie.data.data

  } catch (error) {
    console.log(error)
    return {}
  }
}

export const returnOneSeries = async (seriesId) => {
  try {
    const { access_token, operator_uid } = user_info.data.data

    interceptResponse()

    let req = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/series/${seriesId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    return req.data.data

  } catch (e) {
    console.error(e.message)
  }
}

export const fetchEpisodeInfo = async (id) => {
  try {
    const { access_token, operator_uid } = user_info.data.data
    const response = await axios.get(`https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/episodes/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.data.data
  } catch (e) {
    console.warn(e.message)
  }
}

export const sendPlayLogs = async (id, type, _duration = 0) => {
  let contentDetails
  let contentName
  let contentType = 'Movie'

  if (type === 'live') {
    contentDetails = await fetchChannelInfo(id)
    contentType = 'Movie'
  }

  if (type === 'series') {
    contentDetails = await fetchEpisodeInfo(id)
    contentType = 'Episode'
  }

  if (type === 'movie') {
    contentDetails = await returnMovieOrSeriesDetails(id, 'movie')
    contentType = 'Movie'
  }

  console.warn('contentDetails', contentDetails.uid)

  contentName = contentDetails.title || contentDetails.name

  await sendLog({
    action: 'play',
    content_uid: contentDetails.uid,
    content_type: contentType,
    content_name: contentName,
    duration: _duration
  })
}

export const fetchMovieVideo = (dispatch, id, type) => {
  const { user_id, access_token, operator_uid } = user_info.data.data
  let _url

  interceptResponse()

  if (type === "movie") _url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/vod/movies/${id}`
  if (type === "series") _url = `https://mtnss.tvanywhereafrica.com:11610/api/client/v1/${operator_uid}/users/${user_id}/vod/episodes/${id}`
  if (type === "live") _url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/live/channels/${id}`

  var config = {
    method: 'get',
    url: _url,
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  }

  axios(config)
    .then(async (response) => {
      sendPlayLogs(id, type, 0)
      dispatch(fetchMovieVideo_success(response.data.data));
    })
    .catch(e => {
      console.error(e.message)
      dispatch(fetchMovieVideo_success({ url: '' }));
      // dispatch(fetchMovieVideo_error());
    });
}

export const fetchWatchlist = (dispatch) => {
  try {

    const { user_id, operator_uid, access_token } = user_info.data.data

    interceptResponse()

    var config = {
      method: 'get',
      url: `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/my_content`,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    };

    axios(config)
      .then((response) => {
        dispatch(fetchWatchlistReducer(response.data.data.movie_bookmarks));
      })
      .catch(() => {
        dispatch(fetchMovieVideo_error());
      });
  } catch (e) {
    console.error(e.message)
  }
}

export const getLengthWatched = async (id, _type) => {

  try {

    if (!id) return

    const { user_id, operator_uid, access_token } = user_info.data.data

    interceptResponse()

    let url

    if (_type === 'series') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/episodes/${id}`
    if (_type === 'movie') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}`

    const response = await axios.get(url,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    if (response.data.data[0])
      return response.data.data[response.data.data.length - 1].time
    return 0

  } catch (e) {
    console.error(e.message)
    return 0
  }
}

export const updateWatchlist = async (id, _type, lengthWatchedInMs = 0) => {

  try {

    if (!id) return

    const { user_id, operator_uid, access_token } = user_info.data.data

    interceptResponse()

    let url
    const bookmarkName = id

    if (_type === 'series') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/episodes/${id}`
    if (_type === 'movie') url = `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}/${bookmarkName}`

    await axios.put(url,
      {
        "time": lengthWatchedInMs,
        "name": bookmarkName,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
      }
    )

  } catch (e) {
    console.error('update length err', e)
  }
}

export const removeWatchlist = async (id, _type) => {

  try {

    if (!id) return

    const { user_id, operator_uid, access_token } = user_info.data.data

    interceptResponse()

    await axios.delete(`https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
      }
    )

  } catch (e) {
    console.error('removeWatchlist', e)
  }
}

export const fetchGenres = (dispatch) => {

  const { operator_uid, access_token } = user_info.data.data

  interceptResponse()

  var config = {
    method: 'get',
    url: `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/genres`,
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };

  axios(config)
    .then((response) => dispatch(fetchGenresReducer(response.data.data)))

    .catch(e => {
      console.error(e)
      // dispatch(fetchMovieVideo_error());
    });
}

export const fetchBannerContent = async (type) => {

  try {

    const { access_token, operator_uid } = user_info.data.data

    let currentRoute = window.location.pathname
    let randomBanner
    let movieBanners = []
    let seriesBanners = []
    let liveTvBanners = []
    const afriPremiereBanners = []
    const afriplayLiveBanners = []

    interceptResponse()

    const response = await axios.get(
      `https://ott.tvanywhereafrica.com:28182/api/client/v1/${operator_uid}/banners?translation=en&accessKey=WkVjNWNscFhORDBLCg==`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    response.data.data.filter(item => {
      if (item.vod_type === 'MOVIE') movieBanners.push(item)
      if (item.vod_type === 'SERIES') seriesBanners.push(item)
      if (item.type === 'LIVE') liveTvBanners.push(item)
      return ''
    })

    if (currentRoute === '/home') {
      const _ = []
      const movieSeriesBanners = _.concat(movieBanners, seriesBanners)

      for (let i = 0; i < movieSeriesBanners.length; i++) {
        const element = movieSeriesBanners[i];
        if (!element) return
        const vodInfo = await returnMovieOrSeriesDetails(element.content_id, (element.vod_type).toLowerCase())
        if (!vodInfo) return
        if (vodInfo.metadata.movie_type === 'premiere') afriPremiereBanners.push(element)
        if (vodInfo.metadata.movie_type === 'live') afriplayLiveBanners.push(element)
      }

      return { afriPremiereBanners, afriplayLiveBanners }

    }

    if (currentRoute === '/afripremiere') {
      let _ = movieBanners[Math.round(Math.random() * movieBanners.length)]
      if (_) randomBanner = _
      else randomBanner = movieBanners[0]
    }

    if (currentRoute === '/series') {
      let _ = seriesBanners[Math.round(Math.random() * seriesBanners.length)]
      if (_) randomBanner = _
      else randomBanner = seriesBanners[0]
    }

    if (currentRoute === '/livetv' || currentRoute === '/afriplaylive') {
      let _ = liveTvBanners[Math.round(Math.random() * liveTvBanners.length)]
      if (_) randomBanner = _
      else randomBanner = liveTvBanners[0]
    }

    // console.warn('randomBanner >>', randomBanner)

    if (randomBanner) return randomBanner

  } catch (e) {
    console.error(`banner response`, e.message)
  }
}