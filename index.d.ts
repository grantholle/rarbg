// Type definitions for rarbg
// Project: grantholle/rarbg
// Definitions by: Grant Holle <grantholle.com>

import Rarbg from './index'

export = Rarbg

interface ConfigSettings {
  host: string = 'torrentapi.org',
  path: string = '/pubapi_v2.php?',
  app_id: string = 'rarbg_npm',
  user_agent: string = 'https://github.com/grantholle/rarbg'
}

interface RequestParams {
  search_string?: string,
  search_imdb?: string,
  search_tvdb?: string,
  search_themoviedb?: string,
  category?: any,
  sort?: string,
  limit?: number,
  min_seeders?: number,
  min_leechers?: number
}

declare class Rarbg {
  constructor (config?: ConfigSettings)
  search (params: RequestParams)
  list (params?: RequestParams)

  categories: object = {
    XXX: 4,
    MOVIES_XVID: 14,
    MOVIES_XVID_720: 48,
    MOVIES_X264: 17,
    MOVIES_X264_1080: 44,
    MOVIES_X264_720: 45,
    MOVIES_X264_3D: 47,
    MOVIES_X264_4K: 50,
    MOVIES_X265_4K: 51,
    MOVIES_X265_4K_HDR: 52,
    MOVIES_FULL_BD: 42,
    MOVIES_BD_REMUX: 46,
    TV_EPISODES: 18,
    TV_HD_EPISODES: 41,
    MUSIC_MP3: 23,
    MUSIC_FLAC: 25,
    GAMES_PC_ISO: 27,
    GAMES_PC_RIP: 28,
    GAMES_PS3: 40,
    GAMES_XBOX_360: 32,
    SOFTWARE_PC_ISO: 33,
    E_BOOKS: 35
  }
}
