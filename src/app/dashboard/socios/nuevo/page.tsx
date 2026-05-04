"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guardarSocio } from "./actions";
import { socioSchema, SocioFormData } from "./schema";

export default function NuevoSocioPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema),
  });

  const onSubmit = async (data: SocioFormData) => {
    await guardarSocio(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Registrar Socio</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        <label className="flex flex-col">
          Nombre 
          <input {...register("nombre")} className="border p-2" />
          {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Apellido 
          <input {...register("apellido")} className="border p-2" />
          {errors.apellido && <span className="text-red-500 text-sm">{errors.apellido.message}</span>}
        </label>
        
        <label className="flex flex-col">
          DNI 
          <input {...register("dni")} className="border p-2" />
          {errors.dni && <span className="text-red-500 text-sm">{errors.dni.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Fecha de Nacimiento 
          <input type="date" {...register("fechaNacimiento")} className="border p-2" />
          {errors.fechaNacimiento && <span className="text-red-500 text-sm">{errors.fechaNacimiento.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Ciudad 
          <input type="text" {...register("ciudad")} className="border p-2" />
          {errors.ciudad && <span className="text-red-500 text-sm">{errors.ciudad.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Calle 
          <input type="text" {...register("calle")} className="border p-2" />
          {errors.calle && <span className="text-red-500 text-sm">{errors.calle.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Altura 
          <input type="text" {...register("altura")} className="border p-2" />
          {errors.altura && <span className="text-red-500 text-sm">{errors.altura.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Fecha de Alta 
          <input type="date" {...register("fechaAlta")} className="border p-2" />
          {errors.fechaAlta && <span className="text-red-500 text-sm">{errors.fechaAlta.message}</span>}
        </label>
        <label className="flex flex-col">Fecha de Baja <input type="date" {...register("fechaBaja")} className="border p-2" /></label>
        <label className="flex flex-col">Obra Social <input {...register("obraSocial")} className="border p-2" /></label>
        
        <label className="flex flex-col">
          Plan 
          <input {...register("plan")} className="border p-2" />
          {errors.plan && <span className="text-red-500 text-sm">{errors.plan.message}</span>}
        </label>
        
        <label className="flex flex-col">Sepelio <input {...register("sepelio")} className="border p-2" /></label>
        
        <label className="flex flex-col">
          Cobrador 
          <input {...register("cobrador")} className="border p-2" />
          {errors.cobrador && <span className="text-red-500 text-sm">{errors.cobrador.message}</span>}
        </label>
        
        <label className="flex flex-col">
          Teléfono 
          <input type="text" {...register("telefonos.0")} className="border p-2" />
          {errors.telefonos?.[0] && <span className="text-red-500 text-sm">{errors.telefonos[0].message}</span>}
        </label>
        
        <label className="flex flex-col">
          Correo Electrónico 
          <input type="email" {...register("correos.0")} className="border p-2" />
          {errors.correos?.[0] && <span className="text-red-500 text-sm">{errors.correos[0].message}</span>}
        </label>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition-colors">
          Guardar Socio
        </button>
      </form>
    </div>
  );
}

