### Injectable Config 

Inyectar una configuración y otra dependiendo de las variables de entorno.
Por defecto, si se usa en *NodeJS*, es valor se obtendra de __*process.env.NODE_ENV*__, 
pero tambien se puede pasar por parametro la variable que contiene el nombre del entorno.

Para establecer la variable con la que se determina el entorno, se hace pasando el parametro a la anotacion __*@Configurable*__
````typescript
@Configurable() // se tomara el valor de process.env.NODE_ENV
export class ConfigStartUp {}

o 

@Configurable(AppSethings.env) // se tomara el valor que contenga AppSethings.env en ese momento
export class ConfigStartUp {}
````

Para definir la configuración de cada entorno, se hace con la anotacion *@Config* y recibe por parametro 
el string con el nombre del entorno que debe coincidir con los valores que puede tomar *process.env.NODE_ENV*
o la variable que se haya pasado por parametro en la anotacion *@Configurable*.  
En el siguiente ejemplo se asume que *process.env.NODE_ENV* podria tener los valores *__dev__* o *__st__*.(lo ideal seria no pasar un string si no que los entornos esten definidos de una enumeracion, pero por ejemplo practico se dejo asi).

````typescript

@Configurable()
export class ConfigStartUp {
    
    @Config("dev")
    public configDev() {
      return {
        a:"2"
      }
    }
    
    @Config("st")
    public configst() {
      return {
        a:"3"
      }
    }
    
    @Config("prod")
    ...
}

````

Para definir una configuracion compartida por todos los entornos se hace con la anotacion *@SharedConfig*.  
El objeto que retorne la funcion correspondiente al entorno, sera fucionado con el objeto que retorne 
la funcion con la anotacion *@SharedConfig*.
Suponiendo que *NODE_ENV* tiene como valor *__dev__* el objeto configuracion de resultado, sera: 

````json
{
    "host":"http...",
    "port":"123",
    "shared":"info",
    "any":"value"
}
````

````typescript

@Configurable()
export class ConfigStartUp {
    
    @Config("dev")
    public configDev() {
      return {
        host:"http...",
        port:"123"
      }
    }
    
    @SharedConfig
    public configGeneral() {
      return {
        shared:"info",
        any:"value"
      }
    }
}

````

En accion! 

````typescript

export class AnyClass {
    
  @InjectConfig
  private readonly config
  
  constructor(){
    console.log(this.config)
  }    
}

````

Una ultima cosa, para que todo funcione, se debe instanciar la clase con la anotacion *@Configurable* en el boostrap de la aplicacion
````typescript
export class MainClass {
  
  constructor(){
    new ConfigStartUp() //eso es todo! 
  }    
  ...
}
````

Eso es todo. ahora un ejemplo completo.

####Ejemplo completo

Asumiendo que *NODE_ENV* vale *__st__*

*Config.ts*
````typescript
enum Environment {
  DEV = "dev",
  ST = "st",
  PROD = "prod"
}

export interface IConfig {
  url: string 
  port: number
}

@Configurable()
export class ConfigStartUp {

  @SharedConfig
  public share(): Partial<IConfig>{
    return {
      port:8080
    }
  }

  @Config(Environment.DEV)
  public configDev(): Partial<IConfig> {
    return {
      url:"host-dev"
    }
  }

  @Config(Environment.ST)
  public configst(): Partial<IConfig> {
    return {
      url:"host-st"
    }
  }
}
````

app.component.ts    

````typescript

// Asumiendo que por esta clase inicia nuestra aplicacion, instanciamos la clase ConfigStartUp

export class AppComponent { 

  @InjectConfig
  public readonly config: IConfig

  constructor(){
    new ConfigStartUp()
    console.log(this.config) // { url:"host-dev" , port: 8080 }
  }
  ...
}

````

