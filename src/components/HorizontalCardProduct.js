import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayKESCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)
    const [scroll,setScroll] = useState(0)
    const scrollElement = useRef()
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

    const fetchData = async () => {
        if (!category || typeof category !== 'string') {
            console.warn('❗ Invalid category for fetchCategoryWiseProduct:', category);
            setData([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const categoryProduct = await fetchCategoryWiseProduct(category);
            setLoading(false);

            const validData = Array.isArray(categoryProduct?.data)
                ? categoryProduct.data.filter(p => Array.isArray(p.productImage) && p.productImage.length > 0)
                : [];

            setData(validData);
            console.log('✅ Fetched category products:', validData);
        } catch (error) {
            console.error('🔥 Error fetching category products:', error);
            setData([]);
            setLoading(false);
            }
        };

    useEffect(() => {
        fetchData();
    }, [category]);

    const scrollRight = () =>{
        scrollElement.current.scrollLeft -= 300
    }
    const scrollLeft = () =>{
        scrollElement.current.scrollLeft += 300
    }


  return (
    <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
             
           <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all' ref={scrollElement}>
            <button  className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}>
                <FaAngleLeft/>
            </button>
            <button  className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}>
                <FaAngleRight/>
            </button> 

           {loading ? (
                loadingList.map((_, index) => (
                    <div
                        key={index}
                        className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex"
                        >
                        <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse"></div>
                        <div className="p-4 grid w-full gap-2">
                            <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full"></h2>
                            <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full"></p>
                            <div className="flex gap-3 w-full">
                            <p className="text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full"></p>
                            <p className="text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full"></p>
                            </div>
                            <button className="text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse"></button>
                        </div>
                        </div>
                    ))
                    ) : data.length === 0 ? (
                    <p className="text-gray-500 text-sm">No products found in this category.</p>
                    ) : (
                    data.map(product => (
                        <Link
                        to={'/product/' + product?._id}
                        key={product?._id}
                        className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex overflow-hidden"
                        >
                        <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] flex justify-center items-center overflow-hidden">
                            <img
                            src={product?.productImage?.[0] || '/default-image.png'}
                            alt={product?.productName || 'product'}
                            className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                            />
                        </div>

                        <div className="p-3 grid gap-1 w-full overflow-hidden">
                            <h2 className="font-medium text-sm md:text-base text-black truncate">
                            {product?.productName}
                            </h2>
                            <p className="capitalize text-slate-500 text-xs truncate">{product?.category}</p>
                            <div className="flex items-center justify-between gap-0.5 flex-wrap">
                            <p className="text-red-600 font-medium text-[clamp(0.75rem,2.5vw,0.95rem)] break-words">
                                {displayKESCurrency(product?.sellingPrice)}
                            </p>
                            <p className="text-slate-500 line-through font-medium text-[clamp(0.7rem,2.5vw,0.9rem)] text-right break-words">
                                {displayKESCurrency(product?.price)}
                            </p>
                            </div>
                            <button
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full w-fit"
                            onClick={e => {
                                e.preventDefault();
                                handleAddToCart(e, product?._id);
                            }}
                            >
                            Add to Cart
                            </button>
                        </div>
                        </Link>
                    ))
                    )}
                </div>
                </div>
            );
            };

            // Set default props as fallback
            HorizontalCardProduct.defaultProps = {
            category: '',
            heading: 'Category',
            };

export default HorizontalCardProduct;