import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayKESCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)


    const fetchData = async() =>{
        
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })
       

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }


    }

    const handleLoading = async() =>{
        await fetchData()
    }

    useEffect(()=>{
        setLoading(true)
        handleLoading()
         setLoading(false)
    },[])


    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()


        if(responseData.success){
            fetchData()
        }
    }


    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {   
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if(responseData.success){
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)
  return (
    <div className='container mx-auto'>
        
        <div className='text-center text-lg my-3'>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )
            }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>   
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el,index) => {
                                return(
                                    <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                             
                        ) : (
                          data.map((product,index)=>{
                           return(
                            <div
                                key={product?._id + "Add To Cart Loading"}
                                className="w-full bg-white my-2 border border-slate-300 rounded grid grid-cols-[auto,1fr] overflow-hidden h-auto sm:h-32"
                                >
                            {/* Product Image */}
                            <div className="w-28 sm:w-32 h-28 sm:h-32 bg-slate-200 shrink-0">
                                <img
                                src={product?.productId?.productImage[0]}
                                alt="product"
                                className="w-full h-full object-scale-down mix-blend-multiply"
                                />
                            </div>

                            {/* Details */}
                            <div className="px-3 py-2 relative flex flex-col justify-between overflow-hidden">
                                {/* Delete icon */}
                                <div
                                className="absolute top-0 right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                                onClick={() => deleteCartProduct(product?._id)}
                                >
                                <MdDelete />
                                </div>

                                {/* Name & Category */}
                                <div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-medium truncate">
                                    {product?.productId?.productName}
                                </h2>
                                <p className="capitalize text-slate-500 text-sm sm:text-base truncate">
                                    {product?.productId?.category}
                                </p>
                                </div>

                                {/* Prices */}
                                <div className="flex items-center justify-between gap-2 overflow-hidden mt-1">
                                <p className="text-red-600 font-medium text-[clamp(0.8rem,2.5vw,1rem)] max-w-[6.5rem] sm:max-w-[8rem] md:max-w-[10rem] overflow-hidden whitespace-nowrap text-ellipsis">
                                    {displayKESCurrency(product?.productId?.sellingPrice)}
                                </p>
                                <p className="text-slate-600 font-semibold text-[clamp(0.8rem,2.5vw,1rem)] max-w-[6.5rem] sm:max-w-[8rem] md:max-w-[10rem] overflow-hidden whitespace-nowrap text-ellipsis text-right">
                                    {displayKESCurrency(product?.productId?.sellingPrice * product?.quantity)}
                                </p>
                                </div>

                                {/* Quantity Control */}
                                <div className="flex items-center gap-3 mt-2">
                                <button
                                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                                    onClick={() => decraseQty(product?._id, product?.quantity)}
                                >
                                    -
                                </button>
                                <span className="text-sm">{product?.quantity}</span>
                                <button
                                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                                    onClick={() => increaseQty(product?._id, product?.quantity)}
                                >
                                    +
                                </button>
                                </div>
                            </div>
                            </div>
                           )
                          })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        {
                            loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                                
                            </div>
                            ) : (
                                <div className='h-36 bg-white'>
                                    <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Quantity</p>
                                        <p>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Total Price</p>
                                        <p>{displayKESCurrency(totalPrice)}</p>    
                                    </div>

                                    <button className='bg-blue-600 p-2 text-white w-full mt-2'>Payment</button>

                                </div>
                            )
                        }
                </div>
        </div>
    </div>
  )
}

export default Cart