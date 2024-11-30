'use client'
import React, {useState} from 'react'
import { clearCart } from '@/lib/features/carts/cartSlice'
import { useAppDispatch } from '@/lib/hooks'

const TestPage = () => {

  const dispatch = useAppDispatch();

  const [ status, setStatus ] = useState("");


  const clearCartHandler = () => {
  
    setStatus("clearing cart");

    dispatch(clearCart());

    setStatus("cart cleared");

    }

  return (
    <div className='flex justify-between items-center text-xl underline'>
      
      <p className='text-green-500'> {status} </p>

      <button onClick={clearCartHandler}>
        Clear Cart
      </button>

      This a test page

    </div>
  )
}

export default TestPage
