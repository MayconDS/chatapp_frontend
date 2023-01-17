import Api from '../Api'

const ChatServices = {
  getContactList: async (userId) => {
    let token = localStorage.getItem('chatapp_token')
    let users = await Api.get(`users/all`, {
      headers: {
        'x-access-token': token,
      },
    })
    return users.data
  },
  addNewChat: async (user, targetUser) => {
    let token = localStorage.getItem('chatapp_token')
    let newChat = await Api.post(
      `chat/newchat`,
      {
        user,
        targetUser,
      },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )
  },
  onChatList: async () => {
    let token = localStorage.getItem('chatapp_token')
    let chatlist = await Api.get('chat/chatlist', {
      headers: {
        'x-access-token': token,
      },
    })

    return chatlist.data
  },
  onChatContent: async (chatId, setList, setUsers) => {
    let token = localStorage.getItem('chatapp_token')
    let chatContent = await Api.get(`chat/content/${chatId}`, {
      headers: {
        'x-access-token': token,
      },
    })
    return chatContent.data
  },
  sendMessage: async (chatId, userId, type, body, users) => {
    let token = localStorage.getItem('chatapp_token')

    let send = await Api.post(
      'chat/send',
      {
        chatId: chatId,
        userId: userId,
        type: type,
        body: body,
        users: users,
      },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )
    return send
  },
}

export default ChatServices
