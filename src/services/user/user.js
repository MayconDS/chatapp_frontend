import Api from '../Api'

const UserServices = {
  get: async () => {
    let token = localStorage.getItem('chatapp_token')
    let user = await Api.get('/users/', {
      headers: {
        'x-access-token': token,
      },
    })

    localStorage.setItem('chatapp_user', JSON.stringify(user.data[0]))
    return user.data[0]
  },
  register: (params) => Api.post('/users/register', params),
  login: async (params) => {
    const response = await Api.post('/users/login', params)

    localStorage.setItem('chatapp_user', JSON.stringify(response.data.user))
    localStorage.setItem('chatapp_token', response.data.token)
  },
  logout: async () => {
    localStorage.removeItem('chatapp_user', null)
    localStorage.removeItem('chatapp_token', null)
    window.location.reload()
  },
  choosePicture: async (params) => {
    let token = localStorage.getItem('chatapp_token')

    const formData = new FormData()
    formData.append('file', params)

    let user = await Api.post('/users/upload_pic', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'x-access-token': token,
      },
    })
    localStorage.setItem('chatapp_user', JSON.stringify(user.data))
  },
  updateName: async (params) => {
    let token = localStorage.getItem('chatapp_token')

    await Api.put('/users/name', params, {
      headers: {
        'x-access-token': token,
      },
    })
  },
  searchContact: async (params) => {
    let token = localStorage.getItem('chatapp_token')

    let contacts = await Api.get(`/users/search?query=${params}`, {
      headers: { 'x-access-token': token },
    })
    return contacts.data
  },

  //   updatePassword: (params) => {
  //     let token = localStorage.getItem('token')

  //     Api.put('/users/password', params, {
  //       headers: {
  //         'x-access-token': token,
  //       },
  //     }).then((response) => {
  //       localStorage.setItem('user', JSON.stringify(response.data))
  //     })
  //   },
  //   updateUser: (params) => {
  //     let token = localStorage.getItem('token')

  //     Api.put('/users/user', params, {
  //       headers: {
  //         'x-access-token': token,
  //       },
  //     }).then((response) => {
  //       localStorage.setItem('user', JSON.stringify(response.data))
  //     })
  //   },
  //   updateEmail: (params) => {
  //     let token = localStorage.getItem('token')

  //     Api.put('/users/email', params, {
  //       headers: {
  //         'x-access-token': token,
  //       },
  //     }).then((response) => {
  //       UsersService.login(login(response.data.email, response.data.password))
  //     })
  //   },
  updateBio: async (params) => {
    let token = localStorage.getItem('chatapp_token')

    await Api.put('/users/bio', params, {
      headers: {
        'x-access-token': token,
      },
    })
  },
  deleteAccount: async () => {
    let token = localStorage.getItem('chatapp_token')
    await Api.delete('/users/delete', {
      headers: {
        'x-access-token': token,
      },
    })
  },
}

export default UserServices
