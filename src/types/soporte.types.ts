// src/types/soporte.types.ts

//* usando el endpoint GetClienteById retorna */ 
export interface ObtenerCliente {
    IdCliente : number;
    CodigoUnico : string;
    NombreLegal : string;
    EstaHabilitado : boolean;
    VersionActual : number;
}

//* usando el endpoint GetClienteRucById retorna */ 
export interface ObtenerEmpresa {
    IdEmpresa : number;
    Ruc : string;
    RazonSocial : string;
    NombreComercial : string;
    EstaHabilitado : boolean;
    UsaFacturaElectronica : boolean;
    FechaInicioAdesy: string; // DateOnly se convierte a string en JSON
    FechaFinalAdesy: string | null; // DateOnly? nullable
    CdtVencimiento: string | null; // DateOnly? nullable
    ClienteRucVersionactual: number;

     // Foreign Keys
    IdCliente: number;
    ClienteNombre: string;
    ClienteVersionActual: number;
    
    IdPse: number;
    PseNombre: string;
}

//* usando el endpoint GetClienteRucSucursalById retorna */ 
export interface ObtenerSucursal{
    IdSucursal : number;
    CodigoLocal : string;
    CodigoanexoSunat : string;
    NombreSucursal : string;
    Direccion : string | null;
    EstaHabilitado : boolean;
    FechaApertura : string | null;
    FechaCierre : string | null;
    ClienteRucSucursalVersionActual : number;

    //Foreign Keys
    IdEmpresa : number;
    EmpresaNombre : string;
    ClienteRucVersionActual : number;

    IdPais : number | null;
    PaisNombre : string | null;
    IdDepartamento : number | null;
    DepartamentoNombre : string | null;
    IdProvincia : number | null;
    ProvinciaNombre : string | null;
    IdDistrito : number | null;
    DistritoNombre : string | null;
}

export interface ObtenerPais{
    IdPais : number;
    CodigoPais : string;
    NombrePais : string;
    estaHabilitado : boolean;
}

export interface ObtenerDepartamento{
    IdDepartamento : number;
    CodigoDepartamento : string;
    NombreDepartamento : string;
    IdPais : number;
    NombrePais : string;
    EstaHabilitado : boolean;
}

export interface ObternerProvincia{
    IdProvincia : number;
    CodigoProvincia : string;
    NombreProvincia : string;
    IdDepartamento : number;
    NombreDepartamento : string;
    EstaHabilitado : boolean;
}

export interface ObtenerDistrito{
    IdDistrito : number;
    CodigoDistrito : string;
    NombreDistrito : string;
    IdProvincia : number;
    NombreProvincia : string;
    EstaHabilitado : boolean;
}
