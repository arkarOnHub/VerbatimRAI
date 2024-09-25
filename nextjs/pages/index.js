import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Grid from "@mui/material/Grid2";
import { Box, Typography, Button, TextField } from "@mui/material"; // Use by LoginForm
import useBearStore from "@/store/useBearStore";
import Link from 'next/link';

function Home() {
  return (
    <>

      <main>
        <Box><Link href="/register">Click here to register</Link></Box>
      </main>
    </>
  );
}

export default Home;
