import { FC, useEffect, useState, useCallback } from 'react'
import { Logo, Button, Input } from '@components/ui'
import useLogin from '@framework/auth/use-login'
import { useUI } from '@components/ui/context'
import { validate } from 'email-validator'
import Kabisa from "@components/icons/Kabisa";

interface Props {}

const LoginView: FC<Props> = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { setModalView, closeModal } = useUI()

  const login = useLogin()

  const handleLogin = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    if (!dirty && !disabled) {
      setDirty(true)
      handleValidation()
    }

    try {
      setLoading(true)
      setMessage('')
      await login({
        email,
        password,
      })
      setLoading(false)
      setLoggedIn(true)
      setTimeout(() => {
        closeModal()
      }, 1000)
    } catch ({ errors }) {
      setMessage(errors[0].message)
      setLoading(false)
    }
  }

  const handleValidation = useCallback(() => {
    // Test for Alphanumeric password
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email) || password.length < 7 || !validPassword)
    }
  }, [email, password, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  return (
    <form
      onSubmit={handleLogin}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Kabisa/>
      </div>
      <div className="flex flex-col space-y-3">
        {message && (
          <div className="text-red border border-red p-3">
            {message}. Did you {` `}
            <a
              className="text-accent-9 inline font-bold hover:underline cursor-pointer"
              onClick={() => setModalView('FORGOT_VIEW')}
            >
              forgot your password?
            </a>
          </div>
        )}
        {!loggedIn ?
        <>
        <Input type="email" placeholder="Email" onChange={setEmail} />
          <Input type="password" placeholder="Password" onChange={setPassword} />

          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={disabled}
          >
            Log In
          </Button>
          <div className="pt-1 text-center text-sm">
            <span className="text-accent-7">Don&apos;t have an account?</span>
            {` `}
            <a
              className="text-accent-9 font-bold hover:underline cursor-pointer"
              onClick={() => setModalView('SIGNUP_VIEW')}
            >
              Sign Up
            </a>
          </div>
        </>
          :
          <span className="text-center text-xl">Successfully logged in!</span>
        }
      </div>
    </form>
  )
}

export default LoginView
