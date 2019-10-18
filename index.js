'use strict'

const https = require('https')
const moment = require('moment')
const { stringify } = require('querystring')

module.exports = class RarbgApi {
  /**
   * Construct a new RarbgApi class
   *
   * @param {Object} config The configuration object to use when interacting with the api
   */
  constructor (config) {
    this.config = Object.assign({
      host: 'torrentapi.org',
      path: '/pubapi_v2.php?',
      app_id: 'rarbg_npm',
      user_agent: 'grantholle/rarbg'
    }, config)

    this.categories = {
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
      TV_UHD_EPISODES: 49,
      MUSIC_MP3: 23,
      MUSIC_FLAC: 25,
      GAMES_PC_ISO: 27,
      GAMES_PC_RIP: 28,
      GAMES_PS3: 40,
      GAMES_XBOX_360: 32,
      SOFTWARE_PC_ISO: 33,
      GAMES_PS4: 53
    }
    this.lastRequestTime = moment()
    this.tokenTimestamp = moment('1970-01-01', 'YYYY-MM-DD')
  }

  /**
   * Validates the parameters so it can correctly interact with the api
   *
   * @param {Object} query The object to use against the api
   */
  validateParams (query) {
    return new Promise((resolve, reject) => {
      if (!query.mode) {
        return reject(new Error('Invalid query object -- no search mode'))
      }

      if (query.mode === 'search') {
        if (
          !query.search_string &&
          !query.search_themoviedb &&
          !query.search_tvdb &&
          !query.search_imdb
        ) {
          return reject(new Error('Invalid query object -- no search parameters'))
        }

        if (Array.isArray(query.category)) {
          query.category = query.category.join(';')
        }
      } else if (query.mode !== 'list') {
        return reject(new Error('Invalid query object -- search mode invalid'))
      }

      resolve()
    })
  }

  /**
   * Sets the token from the api so requests can be made
   */
  setToken () {
    return this.sendRequest({
      get_token: 'get_token'
    }).then(res => {
      this._token = res.token
      this.tokenTimestamp = moment()
    })
  }

  /**
   * Either retrieves a saved valid saved token or retrieves a new one
   */
  getToken () {
    if (
      (!this._token && !this._setting_token) ||
      (moment().diff(this.tokenTimestamp, 'minutes') > 14)
    ) {
      return this.setToken()
    }

    return Promise.resolve()
  }

  /**
   * Performs a search of rarbg
   *
   * @param {Object} query The search parameters
   */
  search (query) {
    query.mode = 'search'
    return this.apiRequest(query)
  }

  /**
   * Lists recent torrents from rarbg
   *
   * @param {Object} query The listing parameters
   */
  list (query = {}) {
    query.mode = 'list'
    return this.apiRequest(query)
  }

  /**
   * Makes a request to the api
   *
   * @param {Object} query The parameters to send to make the request
   */
  apiRequest (query) {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.validateParams(query),
        this.getToken()
      ]).then(() => {
        // There's a 1 request/2 second rate limit
        const delay = 2000 - moment().diff(this.lastRequestTime)
        query.token = this._token

        setTimeout(() => {
          this.sendRequest(query).then(({ torrent_results }) => {
            if (!torrent_results) { // eslint-disable-line camelcase
              return reject(new Error('No results found!'))
            }

            resolve(torrent_results)
          }).catch(reject)
        }, delay)
      }).catch(reject)
    })
  }

  /**
   * Sends an http request to the host
   *
   * @param {Object} query The properties to be encoded in the api call
   */
  sendRequest (query) {
    return new Promise((resolve, reject) => {
      query.app_id = this.config.app_id
      const req = {
        host: this.config.host,
        path: this.config.path + stringify(query),
        headers: {
          'user-agent': this.config.user_agent
        }
      }

      https.get(req, res => {
        this.lastRequestTime = moment()
        let body = ''

        res.setEncoding('utf8')

        res.on('data', d => {
          body += d
        })

        res.on('end', () => {
          try {
            const parsed = JSON.parse(body)
            resolve(parsed)
          } catch (err) {
            reject(err)
          }
        })
      }).on('error', reject)
    })
  }
}
