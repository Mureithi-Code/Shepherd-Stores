import React from 'react'
import { MdDelete } from "react-icons/md"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const AdminDeleteProductButton = ({ productId, fetchdata }) => {
  
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?")
    if (!confirmDelete) return

    try {
      const response = await fetch(SummaryApi.deleteProduct.url, {
        method: SummaryApi.deleteProduct.method,
        credentials : 'include',
        headers : {
          "content-type" : "application/json"
        },
        body: JSON.stringify({ productId })
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Product deleted successfully")
        fetchdata()
      } else {
        toast.error(result.message || "Failed to delete product")
      }

    } catch (err) {
      toast.error("Server error. Try again later.")
      console.error("Delete error:", err)
    }
  }

  return (
    <div
      className='p-2 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-full cursor-pointer'
      onClick={handleDelete}
      title="Delete Product"
    >
      <MdDelete />
    </div>
  )
}

export default AdminDeleteProductButton
