from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class tbl_admin(db.Model):
    id_admin = db.Column(db.Integer, primary_key=True)
    nombre_admin = db.Column(db.String(80), nullable=False)
    ap_admin = db.Column(db.String(80), nullable=False)
    am_admin = db.Column(db.String(80), nullable=False)
    n_empleado = db.Column(db.String(80), nullable=False)
    psw = db.Column(db.String(80), nullable=False)    
    correo = db.Column(db.String(120), unique=True, nullable=False)
    puesto = db.Column(db.String(80), nullable=False)
    imagen = db.Column(db.String(80), nullable=False)

class tbl_carrusel(db.Model):
    id_imagen = db.Column(db.Integer, primary_key=True)
    imagen = db.Column(db.String(200))
    
class tbl_catal_autos(db.Model):
    id_auto = db.Column(db.Integer, primary_key=True)
    modelo_auto = db.Column(db.String(100), nullable=False)
    año_auto = db.Column(db.String(80), nullable=False)
    km_auto = db.Column(db.Integer, nullable=False)
    gasolina = db.Column(db.String(100), nullable=False)
    transmision = db.Column(db.String(100), nullable=False)    
    marca = db.Column(db.String(100), unique=True, nullable=False)
    imagen = db.Column(db.String(20000), nullable=False)
    descripcion = db.Column(db.String(1200), unique=True, nullable=False)
    pago_inicial = db.Column(db.Integer, nullable=False)
    precio_lista = db.Column(db.Integer, nullable=False)


class tbl_catal_motos(db.Model):
    id_moto = db.Column(db.Integer, primary_key=True)
    modelo_moto = db.Column(db.String(100), nullable=False)
    año_moto = db.Column(db.String(80), nullable=False)
    gasolina = db.Column(db.String(100), nullable=False)
    trasmision = db.Column(db.String(100), nullable=False)    
    marca = db.Column(db.String(100), unique=True, nullable=False)
    imagen = db.Column(db.String(20000), nullable=False)
    descripcion = db.Column(db.String(250), unique=True, nullable=False)
    precio_inicial = db.Column(db.Integer, nullable=False)
    precio_lista = db.Column(db.Integer, nullable=False)
    
class tbl_coti_autos(db.Model):
        id_coti_auto = db.Column(db.Integer, primary_key=True)
        modelo_coti_auto = db.Column(db.String(100), nullable=False)
        año_coti_auto = db.Column(db.String(100), nullable=False)
        nombre_coti_auto = db.Column(db.String(100), nullable=False)
        ap_coti_auto = db.Column(db.String(100), nullable=False)    
        am_coti_auto = db.Column(db.String(100), unique=True, nullable=False)
        celular_coti_auto = db.Column(db.Integer, nullable=False)
        correo_coti_auto = db.Column(db.String(150), unique=True, nullable=False)
        fecha_coti = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

 
class tbl_coti_motos(db.Model):
    id_coti_moto = db.Column(db.Integer, primary_key=True)
    modelo_coti_moto = db.Column(db.String(100), nullable=False)
    año_coti_moto = db.Column(db.String(100), nullable=False)
    nombre_comp = db.Column(db.String(100), nullable=False)
    ap_coti_moto = db.Column(db.String(100), nullable=False)    
    am_coti_moto = db.Column(db.String(100), unique=True, nullable=False)
    celular_coti_moto = db.Column(db.Integer, nullable=False)
    correo_coti_moto = db.Column(db.String(150), unique=True, nullable=False)
    fecha_coti = db.Column(db.Date, default=datetime.utcnow, nullable=False)
