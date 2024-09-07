import React from 'react'
import MyPhotos from "../../components/MyPhotos/Index"
import { useParams } from "react-router-dom";

const Index = () => {
  const { aid } = useParams();

  return <MyPhotos albumId={aid} />
}

export default Index
