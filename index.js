'use strict'

const https = require('https'),
      querystring = require('querystring'),
      moment = require('moment'),
      config = {
        host: 'torrentapi.org',
        path: '/pubapi_v2.php?'
      }


module.exports = {

  categories: {
    XXX: 4,
    MOVIES_XVID: 14,
    MOVIES_XVID_720: 48,
    MOVIES_X264: 17,
    MOVIES_X264_1080: 44,
    MOVIES_X264_720: 45,
    MOVIES_X264_3D: 47,
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
  },

  lastRequestTime: moment(),
  tokenTimestamp: moment('1970-01-01', 'YYYY-MM-DD'),

  validateParams(query) {
    return new Promise((resolve, reject) => {
      if (!query.mode) {
        return reject('Invalid query object -- no search mode')
      } else if (query.mode === 'search') {
        if (!query.search_string &&
            !query.search_themoviedb &&
            !query.search_tvdb &&
            !query.search_imdb) {

          return reject('Invalid query object -- no search parameters')
        }
      } else if (query.mode !== 'list') {
        return reject('Invalid query object -- search mode invalid')
      }

      resolve()
    })
  },

  setToken() {
    this._setting_token = true

    return this.sendRequest({
      get_token: 'get_token'
    }).then(response => {
      this._token = response.token
      this._setting_token = false
      this.tokenTimestamp = moment()
    })
  },

  getToken() {
    if ((!this._token && !this._setting_token) || (moment().diff(this.tokenTimestamp, 'minutes') > 14))
      return this.setToken()

    return new Promise((resolve, reject) => {
      if (this._token) {
        return resolve()
      }

      (function waitForToken() {
        if (!this._setting_token)
          return resolve()

        setTimeout(waitForToken.bind(this), 100)
      }).bind(this)()
    }).then(() => true)
  },

  search(query) {
    query.mode = 'search'

    return this.apiRequest(query)
  },

  list(query = {}) {
    query.mode = 'list'

    return this.apiRequest(query)
  },

  apiRequest(query) {
    return new Promise((resolve, reject) => {
      Promise.all([this.validateParams(query), this.getToken()])
        .then(() => {
          // There's a 1 request/2 second rate limit
          const delay = 2000 - moment().diff(this.lastRequestTime)
          query.token = this._token

          setTimeout(() => {
            this.sendRequest(query)
              .then(results => {
                if (results.torrent_results)
                  resolve(results.torrent_results)
                else
                  reject(results)
              })
              .catch(e => reject(e))
          }, delay > 0 ? delay : 0)
        })
    })
  },

  sendRequest(query) {
    return new Promise((resolve, reject) => {
      const req = {
        host: config.host,
        path: config.path + querystring.stringify(query)
      }

      https.get(req, res => {
        this.lastRequestTime = moment()
        let body = ''

        res.on('data', d => {
          body += d
        })

        res.on('end', () => {
          resolve(JSON.parse(body))
        })

        res.on('error', e => {
          reject(e)
        })

      })
    })
  }

}
