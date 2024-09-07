import React from 'react'
import Camera from "../../../components/Camera/Index";
import { useParams } from "react-router-dom";


const Index = () => {
  const { aid } = useParams();

  return <Camera albumId={aid} />
}

export default Index