import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    localStorage.removeItem('token')
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage('Goodbye!')
    // In any case, we should redirect the browser back to the login screen,
    redirectToLogin()
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
    // and launch a request to the proper endpoint.
    try {
      const res = await axios.post(
        loginUrl,
        { 'username': `${username}`, 'password': `${password}` }
      ) 
        localStorage.setItem('token', res.data.token)
        setMessage(`${res.data.message}`)
        redirectToArticles()
    } catch (err) {
      setMessage(err.response.data.message)
    } finally { 
      setSpinnerOn(false)
    }
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    // and launch an authenticated request to the proper endpoint.
      const fetchArticles = async () => {
        try {
          const res = await axios.get(
            articlesUrl,
            { headers: { Authorization: token } },
          )
          setArticles(res.data.articles)
          setMessage(res.data.message)
        } catch (err) {
          if (err.response.status == 401) logout()
        } finally { 
          setSpinnerOn(false)
        }
      }
      fetchArticles()
    }
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!



  const postArticle = payload => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    const PostingArticles = async () => {
      try {
         const res = await axios.post(
          articlesUrl,
          { 'title': `${payload.title}`, 'text': `${payload.text}`, 'topic': `${payload.topic}`},
          { headers: { Authorization: token }, 
          'Content-Type': 'application/json'}, 
        )
        console.log(res.data)
        const newArt = res.data.article
        setArticles([...articles, newArt]);
        setMessage(res.data.message)
      } catch (err) {
        console.log(err.message)
      } finally { 
        setSpinnerOn(false)
      }
    }
    PostingArticles()
  }

  const updateArticle = (payload, currentArticle) => {
    // ✨ implement
    // You got this!
    const article_id = currentArticle.article_id
    const token = localStorage.getItem('token')
    setSpinnerOn(true)
    const PuttingArticles = async () => {
      try {
        const res = await axios.put(
          `http://localhost:9000/api/articles/${article_id}`,
          { 'title': `${payload.title}`, 'text': `${payload.text}`, 'topic': `${payload.topic}`},
          { headers: { Authorization: token } }, 
        )
        const updatedArt = res.data.article
        setMessage(res.data.message)
        setArticles((prevArticles) =>
            prevArticles.map((art) =>
              art.article_id === article_id ? updatedArt : art
            )
          );
      } catch (err) {
        setMessage(err.response.message)
      } finally { 
        setSpinnerOn(false)
      }
    }
    PuttingArticles()
  }

  const deleteArticle = article_id => {
    // ✨ implement
    const token = localStorage.getItem('token')
    setSpinnerOn(true)
    const deletingArticle = async () => {
      try {
        const res = await axios.delete(
          `http://localhost:9000/api/articles/${article_id}`,
          { headers: { Authorization: token } }
        )
        setArticles((prevArticles) =>
          prevArticles.filter((art) => art.article_id !== article_id)
        );
        setMessage(res.data.message)
      } catch (err) {
        console.log(err.message)
      } finally { 
        setSpinnerOn(false)
      }
    }
    deletingArticle()
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm getArticles={getArticles} updateArticle={updateArticle} postArticle={postArticle} articles={articles} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId}/>
              <Articles deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
