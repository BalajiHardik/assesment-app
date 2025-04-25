import React,{useState,useEffect} from "react";
import axios from "axios";
import './Forms.css';
interface Auction{
    id?:number,
    name:string,
    category:string,
    StartBid:number,
    HighBid:number
}
const Forms=()=>{
    const [data,setData]=useState<Auction[]>([]);
    const [formData,setFormData]=useState<Auction>({
        name:"",
        category:"",
        StartBid:0,
        HighBid:0
    });
    const [editingId,seteditingId]=useState<number | null>(null);
    useEffect(()=>{
        fetchData();
    },[]);
    const fetchData=()=>{
        axios.get('http://localhost:3000/data').then((res)=>{
            setData(res.data);
        })
        .catch((err)=>{console.log(err)});
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        if(editingId!==null){
            axios.put(`http://localhost:3000/data/${editingId}`,formData).then((res)=>{
                fetchData();
                seteditingId(null);
            })
            .catch((err)=>{console.log(err)});
        }
        else{
            axios.post('http://localhost:3000/data',formData).then((res)=>{
                setFormData({name:"",category:"",StartBid:0,HighBid:0});
                fetchData();
                alert("Submitted Successfully");
            })
            .catch((err)=>{console.log(err)});
        }
    }
    const handleEdit=(id:number)=>{
        axios.get(`http://localhost:3000/data/${id}`).then((res)=>{
            setFormData(res.data);
            seteditingId(id);
            
        })
        .catch((err)=>{console.log(err)});
    }
    const handleDelete=(id:number)=>{
        axios.delete(`http://localhost:3000/data/${id}`).then((res)=>{
            fetchData();
            alert("Deleted Successfully");

        })
    }
    return(
        <div>
            <h1>Auction Details</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange}/><br/><br/>
                <input type="text" placeholder="Category" name="category" value={formData.category} onChange={handleChange}/><br/><br/>
                <input type="number" placeholder="StartBid" name="StartBid" value={formData.StartBid} onChange={handleChange}/><br/><br/>
                <input type="number"  placeholder="HighBid" name="HighBid" value={formData.HighBid} onChange={handleChange}/><br/> <br/>
                <button type="submit" id="submit">Submit</button>
            </form>
            <table className="table-container">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>StartBid</th>
                        <th>HighBid</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item)=>{
                        return(
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.StartBid}</td>
                                <td>{item.HighBid}</td>
                                <td>
                                    <button onClick={()=>handleEdit(item.id)}  id="edit-btn">Edit</button>&nbsp;&nbsp;&nbsp;
                                    <button onClick={()=>handleDelete(item.id)} id="delete-btn">Delete</button>&nbsp;&nbsp;
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
export default Forms;