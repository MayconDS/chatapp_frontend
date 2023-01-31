import { getApp, getApps, initializeApp } from 'firebase/app'
import { deleteUser, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import firebaseConfig from './firebaseConfig'

import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  collection,
  updateDoc,
  getDocs,
  arrayUnion,
  addDoc,
  onSnapshot,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatappbackend-production-3265.up.railway.app',
})

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore(app)

export const Auth = getAuth(app)

const FirebaseServices = {
  addUser: async (params) => {
    await setDoc(doc(db, 'users', params.uid), {
      email: params.email,
      name: params.name,
      user: params.user,
      uid: params.uid,
      bio: 'Olá sou novo no chat',
      avatar:
        'https://chatappbackend-production-3265.up.railway.app/images/avatar.webp',
    })
  },
  login: async (params) => {
    await signInWithEmailAndPassword(Auth, params.email, params.password)
      .then(async (res) => {
        const user = await getDoc(doc(db, 'users', res.user.uid))
        let data = user.data()
        localStorage.setItem(
          'chatapp_user',
          JSON.stringify({
            name: data.name,
            email: data.email,
            user: data.user,
            uid: res.user.uid,
          }),
        )
      })
      .catch((err) => {
        console.log(err.message)
      })
  },
  getContactList: async (userId) => {
    let list = []
    const results = await getDocs(collection(db, 'users'))
    results.forEach((doc) => {
      let data = doc.data()
      if (data.uid !== userId) {
        list.push({
          uid: doc.id,
          name: data.name,
          user: data.user,
          avatar: data.avatar,
          bio: data.bio,
        })
      }
    })
    return list
  },
  addNewChat: async (user, user2) => {
    try {
      let userCondition1 = null
      let userCondition2 = null
      const newChatRef = collection(db, 'chats')
      await getDocs(newChatRef).then((doc) => {
        doc.forEach((doc2) => {
          let docData = doc2.data()
          docData.users.forEach((userCondition) => {
            if (userCondition.uid == user.uid) {
              userCondition1 = '1'
            } else if (userCondition.uid == user2.uid) {
              userCondition2 = '1'
            }
          })
        })
      })
      if (userCondition1 == '1' && userCondition2 == '1') {
        return
      }
      let newChat = await addDoc(newChatRef, {
        chatId: 'undefined',
        messages: [],
        users: [user, user2],
      })
      await updateDoc(doc(db, 'chats', newChat.id), {
        chatId: newChat.id,
      })

      const userRef = doc(db, 'users', user.uid)
      const user2Ref = doc(db, 'users', user2.uid)

      await updateDoc(userRef, {
        chats: arrayUnion({
          chatId: newChat.id,
        }),
      })

      await updateDoc(user2Ref, {
        chats: arrayUnion({
          chatId: newChat.id,
        }),
      })
    } catch (error) {
      console.log(error.message)
    }
  },
  onChatList: async (userId, setChatlist, setChatlistBackup) => {
    return onSnapshot(collection(db, 'chats'), (doc) => {
      let chats = []
      doc.forEach((chat) => {
        let data = chat.data()
        if (data.users) {
          data.users.forEach((user) => {
            if (user.uid == userId) {
              chats.push(data)
            }
          })
        }
      })
      setChatlist(chats)
      setChatlistBackup(chats)
    })
  },
  onChatContent: (chatId, setList, setUsers) => {
    return onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists) {
        let data = doc.data()
        setList(data.messages)
        setUsers(data.users)
      }
    })
  },
  sendMessage: async (chatData, user, type, body, users) => {
    let ref = doc(db, 'chats', chatData.chatId)
    let id = Math.floor(Date.now() * Math.random()).toString(36)
    await updateDoc(ref, {
      messages: arrayUnion({
        type,
        author: {
          name: user.name,
          user: user.user,
          uid: user.uid,
          bio: user.bio,
          avatar: user.avatar,
        },
        body,
        date: new Date(),
        uid: id,
        chatId: chatData.chatId,
      }),
    })
  },
  addAvatar: async (userId, file) => {
    const formData = new FormData()
    formData.append('file', file)

    let picture = await Api.post('/images/upload_pic', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    })

    await setDoc(
      doc(db, 'users', userId),
      {
        avatar: `https://chatappbackend-production-3265.up.railway.app/images/${picture.data.key}`,
      },
      { merge: true },
    )
  },
  updateBio: async (userId, bio) => {
    await setDoc(
      doc(db, 'users', userId),
      {
        bio,
      },
      { merge: true },
    )
  },
  updateName: async (userId, name) => {
    await updateDoc(doc(db, 'users', userId), {
      name: name,
    })
  },
  getUser: (userId, setUser) => {
    let user = getDoc(doc(db, 'users', userId)).then((doc) => {
      localStorage.setItem('chatapp_user', JSON.stringify(doc.data()))
    })
  },
  monitoringUser: async (userId, setUser) => {
    return onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists) {
        let data = doc.data()
        updateInfoInChats(userId)
        setUser(data)

        localStorage.setItem('chatapp_user', JSON.stringify(data))
      }
    })
  },
  deleteMessage: async (data) => {
    let chat = null
    let messages = []
    await getDoc(doc(db, 'chats', data.chatId)).then((doc) => {
      chat = doc.data()
    })
    messages = chat.messages.filter((item) => item.uid !== data.uid)
    await updateDoc(doc(db, 'chats', data.chatId), {
      messages: messages,
    })
  },
  clearMessages: async (data) => {
    await updateDoc(doc(db, 'chats', data.chatId), {
      messages: [],
    })
  },
  deleteChat: async (dataChat) => {
    await deleteDoc(doc(db, 'chats', dataChat.chatId))
    dataChat.users.forEach(async (user) => {
      let chats = []
      await getDoc(doc(db, 'users', user.uid)).then((doc) => {
        let data = doc.data()
        chats = data.chats.filter((chat) => chat.chatId !== dataChat.chatId)
      })
      await updateDoc(doc(db, 'users', user.uid), {
        chats: chats,
      })
    })
  },
  deleteAccount: async (userId) => {
    const user = Auth.currentUser
    deleteUser(user)
      .then(async () => {
        await deleteDoc(doc(db, 'users', userId))
        FirebaseServices.deleteAllChatsInUsers(userId)
        localStorage.removeItem('chatapp_user')
        localStorage.removeItem('chatapp_token')
        window.location.reload()
      })
      .catch((error) => {
        console.log(error)
      })
  },
  deleteAllChatsInUsers: async (userId) => {
    let chatsId = []
    const chats = await getDocs(collection(db, 'chats')).then((doc) => {
      doc.forEach((doc2) => {
        let data = doc2.data()
        data.users.forEach((user) => {
          if (user.uid == userId) {
            chatsId.push(data.chatId)
          }
        })
      })
    })
    chatsId.forEach(async (chat) => {
      await getDoc(doc(db, 'chats', chat)).then((doc1) => {
        let data = doc1.data()
        let chats = data.users.forEach(async (user) => {
          if (user.uid !== userId) {
            let chats = []
            await getDoc(doc(db, 'users', user.uid)).then((doc2) => {
              let newData = doc2.data()
              chats = newData.chats.filter((chatId) => chatId.chatId !== chat)
            })
            console.log('chatssssss', chats)
            await updateDoc(doc(db, 'users', user.uid), {
              chats: chats,
            })
          }
        })
      })
      await deleteDoc(doc(db, 'chats', chat))
    })
  },
  searchContact: async (params, userId) => {
    let list = []
    const userRef = collection(db, 'users')
    const q = query(userRef, where('name', '>=', params))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      if (data.uid !== userId) {
        list.push({
          uid: data.uid,
          name: data.name,
          user: data.user,
          avatar: data.avatar,
          bio: data.bio,
        })
      }
    })
    return list
  },
}
const updateInfoInChats = async (userId) => {
  let newUser = await getDoc(doc(db, 'users', userId))
  await getDocs(collection(db, 'chats')).then((chat) => {
    chat.forEach(async (item) => {
      let messages = []
      let users = []
      let data = item.data()
      if (data.users.length > 0) {
        data.users.forEach(async (user) => {
          if (user.uid == userId) {
            user = newUser.data()
          }
          users.push(user)
        })
      }
      if (data.messages.length > 0) {
        data.messages.forEach((message) => {
          if (message.author.uid == userId) {
            message.author = newUser.data()
          }
          messages.push(message)
        })
      }

      await updateDoc(doc(db, 'chats', data.chatId), {
        users: users,
        messages: messages,
      })
    })
  })
}
export default FirebaseServices
