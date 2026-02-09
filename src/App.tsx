import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Search from "./pages/Search";
import Plans from "./pages/Plans";
import MovieDetail from "./pages/MovieDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import Departments from "./pages/admin/Departments";
import Cities from "./pages/admin/Cities";
import Genres from "./pages/admin/Genres";
import Sexes from "./pages/admin/Sexes";
import DocTypes from "./pages/admin/DocTypes";
import Actors from "./pages/admin/Actors";
import Directors from "./pages/admin/Directors";
import Memberships from "./pages/admin/Memberships";
import AudiovisualContent from "./pages/admin/AudiovisualContent";
import Users from "./pages/admin/Users";
import Customers from "./pages/admin/Customers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plans" element={<Plans />} />

          {}
          <Route path="/search" element={
            <RequireAuth>
              <Search />
            </RequireAuth>
          } />
          <Route path="/movie/:id" element={
            <RequireAuth>
              <MovieDetail />
            </RequireAuth>
          } />

          {}
          <Route path="/admin/departments" element={
            <RequireAdmin>
              <Departments />
            </RequireAdmin>
          } />
          <Route path="/admin/cities" element={
            <RequireAdmin>
              <Cities />
            </RequireAdmin>
          } />
          <Route path="/admin/genres" element={
            <RequireAdmin>
              <Genres />
            </RequireAdmin>
          } />
          <Route path="/admin/sex" element={
            <RequireAdmin>
              <Sexes />
            </RequireAdmin>
          } />
          <Route path="/admin/doctypes" element={
            <RequireAdmin>
              <DocTypes />
            </RequireAdmin>
          } />
          <Route path="/admin/actors" element={
            <RequireAdmin>
              <Actors />
            </RequireAdmin>
          } />
          <Route path="/admin/directors" element={
            <RequireAdmin>
              <Directors />
            </RequireAdmin>
          } />
          <Route path="/admin/memberships" element={
            <RequireAdmin>
              <Memberships />
            </RequireAdmin>
          } />
          <Route path="/admin/content" element={
            <RequireAdmin>
              <AudiovisualContent />
            </RequireAdmin>
          } />
          <Route path="/admin/users" element={
            <RequireAdmin>
              <Users />
            </RequireAdmin>
          } />
          <Route path="/admin/customers" element={
            <RequireAdmin>
              <Customers />
            </RequireAdmin>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
