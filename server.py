from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from models import db, tbl_admin, tbl_carrusel, tbl_catal_autos, tbl_catal_motos, tbl_coti_autos, tbl_coti_motos  # Importa la instancia db y los modelos desde conex.py
from conex import DATABASE_URI
from flask import send_from_directory
from werkzeug.utils import secure_filename
from flask_login import current_user, LoginManager
import os
from datetime import datetime, timedelta
import numpy as np
import matplotlib.pyplot as plt
import calendar

from flask import jsonify
from random import choice  # Import the 'choice' function from the 'random' module
from datetime import datetime
import base64
import plotly.express as px


from functools import wraps

from werkzeug.security import check_password_hash

app = Flask(__name__)
app.config.from_object(__name__)
# Configura la conexión a la base de datos MySQL.
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
SECRET_KEY = 'mwefnknglkskngkds smksdgksng kmdsksdnglks lkmdgklns'

# Crea una instancia de SQLAlchemy y enlázala con la aplicación Flask.
db.init_app(app)
# Configuración para subir imágenes
UPLOAD_FOLDER = 'static/image/carrusel'
UPLOAD_FOLDER_2= 'static/image/catalogo_autos'
UPLOAD_FOLDER_3= 'static/image/catalogo_motos'
UPLOAD_FOLDER_4 = 'static/image/administradores'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPLOAD_FOLDER_2'] = UPLOAD_FOLDER_2
app.config['UPLOAD_FOLDER_3'] = UPLOAD_FOLDER_3
app.config['UPLOAD_FOLDER_4'] = UPLOAD_FOLDER_4


# Función para verificar si el administrador ha iniciado sesión.
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'administrador_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

#Rutas Clientes
@app.route("/")
def home():
    route_name = request.path  # Obtiene la ruta actual
    imagenes = tbl_carrusel.query.all()
    return render_template('clientes/Home.html', route_name=route_name,imagenes=imagenes)

@app.get('/gestion')
def gestion():
    return render_template('clientes/gestion.html')

@app.get('/financiamiento')
def financiamiento():
    catalogo = tbl_catal_autos.query.all()
    catalogo_motos=tbl_catal_motos.query.all()
    
    random_auto = choice(catalogo)
    random_moto = choice(catalogo_motos)

    
    random_auto = choice(catalogo)
    return render_template('clientes/financiamiento.html',catalogo=[random_auto], catalogo_motos=[random_moto])

# Ruta del cliente.
@app.get("/login")
def login():
    return render_template('login_admin.html')

@app.post("/login_session")
def login_session():
    username = request.form['username']
    password = request.form['password']
    user = tbl_admin.query.filter_by(n_empleado=username, psw=password).first()
    if user:
        # Inicio de sesión exitoso
        session['administrador_id'] = user.id_admin
        return redirect(url_for('bienvenida'))
    else:
        # Las credenciales son incorrectas
        error = "Credenciales incorrectas. Inténtalo de nuevo."
        return render_template('login_admin.html', error=error)

@app.get('/dashboard')
@login_required
def dashboard():
    route_name = request.path  # Obtiene la ruta actual
    imagenes = tbl_carrusel.query.all()
    admin = tbl_admin.query.get(session['administrador_id'])
    return render_template('dashbord_admin.html', route_name=route_name, imagenes=imagenes, admin=admin)

@app.get('/info_unidad/<id_auto>')
def info_unidad(id_auto):
    catalogo = tbl_catal_autos.query.get(id_auto)
    modelo = tbl_catal_autos.query.all()

    return render_template('clientes/informacion_auto.html', catalogo=catalogo, modelo=modelo)

@app.get('/info_moto/<int:id_moto>')
def info_moto(id_moto):
    catalogo_moto = tbl_catal_motos.query.get(id_moto)
    modelo = tbl_catal_motos.query.all()

    return render_template('clientes/informacion_moto.html', catalogo_moto=catalogo_moto, modelo=modelo)
#Ruta para Cerrar Sesion
@app.route('/logout')
@login_required
def logout():
    session.pop('administrador_id', None)  # Elimina la variable de sesión
    return redirect(url_for('login'))  # Redirige al usuario a la página de inicio de sesión

# Deshabilitar la función "atrás" en el navegador
@app.after_request
def add_no_cache_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

#Funciona para subir imagenes 
# Función para verificar las extensiones de archivo permitidas
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Ruta para subir imágenes
@app.post('/subir_imagen')
@login_required
def subir_imagen():
    if 'imagen' not in request.files:
        flash('No se ha seleccionado ningún archivo', 'error')
        return redirect(request.url)

    imagen = request.files['imagen']

    if imagen.filename == '':
        flash('Archivo de imagen no válido', 'error')
        return redirect(request.url)

    if imagen and allowed_file(imagen.filename):
        filename = secure_filename(imagen.filename)
        ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        imagen.save(ruta)

        # Guarda la ruta de la imagen en la base de datos
        nueva_imagen = tbl_carrusel(imagen=filename)
        db.session.add(nueva_imagen)
        db.session.commit()

        flash('Imagen subida con éxito', 'success')
        return redirect(url_for('dashboard'))
    else:
        flash('Extensión de archivo no válida', 'error')
        return redirect(request.url)

# Ruta para servir imágenes desde la carpeta "uploads"
@app.route('/static/image/carrusel/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.get('/eliminar_imagen/<int:id_imagen>')
def eliminar_imagen(id_imagen):
    # Aquí debes escribir el código para eliminar la imagen con el ID proporcionado
    # Puedes utilizar SQLAlchemy o cualquier otra biblioteca que estés utilizando para la base de datos
    # Por ejemplo, si usas SQLAlchemy, puedes hacer algo como esto:
    imagen_a_eliminar = tbl_carrusel.query.get(id_imagen)
    if imagen_a_eliminar:
        db.session.delete(imagen_a_eliminar)
        db.session.commit()
    return redirect(url_for('dashboard'))

@app.get('/catalogo_auto')
def catalogo_auto():
    catalogo = tbl_catal_autos.query.all()

    return render_template('clientes/catalogo_autos.html', catalogo=catalogo)
@app.get('/catalogo_moto')
def catalogo_moto():
    catalogo_motos=tbl_catal_motos.query.all()

    return render_template('clientes/catalogo_motos.html', catalogo_motos=catalogo_motos)
@app.get('/bienvenida')
@login_required
def bienvenida():
    admin = tbl_admin.query.get(session['administrador_id'])
    return render_template('admin/welcome_admin.html', admin=admin)

#Rutas para agregar autos al catalogo
@app.get('/catalogo')
@login_required
def catalogo():
    admin = tbl_admin.query.get(session['administrador_id'])
    catalogo = tbl_catal_autos.query.all()
    return render_template('admin/catalogo_auto.html', catalogo=catalogo, admin=admin)

@app.post('/agregar_auto')
def agregar_auto():
    if request.method == 'POST':
        modelo_auto = request.form['modelo_auto']
        año_auto = request.form['año_auto']
        km_auto = request.form['km_auto']
        gasolina = request.form['gasolina']
        transmision = request.form['transmision']
        marca = request.form['marca']
        descripcion = request.form['descripcion']
        precio_lista = request.form['precio_lista']
        pago_inicial = request.form['pago_inicial']
        imagen = request.files.getlist('imagen')

        nombres_imagenes = []  

        for imagen in imagen:
            if imagen and allowed_file(imagen.filename):
                filename = secure_filename(imagen.filename)
                ruta = os.path.join(app.config['UPLOAD_FOLDER_2'], filename)
                imagen.save(ruta)
                nombres_imagenes.append(filename)  

        imagenes_str = ",".join(nombres_imagenes)

        nuevo_auto = tbl_catal_autos(
            modelo_auto=modelo_auto,
            año_auto=año_auto,
            km_auto=km_auto,
            gasolina=gasolina,
            transmision=transmision,
            marca=marca,
            descripcion=descripcion,
            pago_inicial=pago_inicial,
            precio_lista=precio_lista,
            imagen=imagenes_str 
        )

        db.session.add(nuevo_auto)
        db.session.commit()

        flash('Nuevo auto agregado con éxito', 'success')
        return redirect(url_for('catalogo'))     
    else:
        flash('Error al agregar el auto', 'error')
        return redirect(url_for('catalogo'))

@app.get('/eliminar_auto/<id_auto>')
@login_required
def eliminar_auto(id_auto):
    catalogo = tbl_catal_autos.query.get(id_auto)

    if not catalogo:
        flash('El auto no existe', 'error')
        return redirect(url_for('catalogo'))

    # Realizar la eliminación del catalogo
    db.session.delete(catalogo)
    db.session.commit()

    flash('Auto eliminado exitosamente', 'success')
    return redirect(url_for('catalogo'))

@app.post('/actualizar_auto/<id_auto>/post')
def actualizar_auto(id_auto):
    catalogo = tbl_catal_autos.query.get(id_auto)
    act_modelo_auto = request.form['act_modelo_auto']
    act_año_auto = request.form['act_año_auto']
    act_km_auto = request.form['act_km_auto']
    act_gasolina = request.form['act_gasolina']
    act_transmision = request.form['act_transmision']
    act_marca = request.form['act_marca']
    act_descripcion = request.form['act_descripcion']
    act_pago_inicial = request.form['act_pago_inicial']
    act_precio_lista = request.form['act_precio_lista']

    
    if act_modelo_auto != None and act_modelo_auto != '':
        catalogo.modelo_auto = act_modelo_auto
        
    if act_año_auto != None and act_año_auto != '':
        catalogo.año_auto= act_año_auto
    
    if act_km_auto != None and act_km_auto != '':
        catalogo.km_auto = act_km_auto
    
    if act_gasolina != None and act_gasolina != '':
        catalogo.gasolina = act_gasolina
    
    if act_transmision != None and act_transmision != '':
        catalogo.transmision = act_transmision
    
    if act_marca != None and act_marca != '':
        catalogo.marca = act_marca
    
    if act_descripcion != None and act_descripcion != '':
        catalogo.descripcion = act_descripcion
    
    if act_pago_inicial != None and act_pago_inicial != '':
        catalogo.pago_inicial = act_pago_inicial
    
    if act_precio_lista != None and act_precio_lista != '':
        catalogo.precio_lista = act_precio_lista
        
      # Obtener la lista de archivos de imágenes del formulario
    nuevas_imagenes = request.files.getlist('act_imagen')

    nombres_nuevas_imagenes = []  # Almacenará los nombres de archivo de las nuevas imágenes

    # Procesar las nuevas imágenes
    for nueva_imagen in nuevas_imagenes:
        if nueva_imagen and allowed_file(nueva_imagen.filename):
            nuevo_nombre = secure_filename(nueva_imagen.filename)
            nueva_ruta = os.path.join(app.config['UPLOAD_FOLDER_2'], nuevo_nombre)
            nueva_imagen.save(nueva_ruta)
            nombres_nuevas_imagenes.append(nuevo_nombre)

    # Agregar los nuevos nombres de archivo a la lista existente en la base de datos
    if nombres_nuevas_imagenes:
        imagenes_actuales = catalogo.imagen.split(",") if catalogo.imagen else []
        imagenes_actuales.extend(nombres_nuevas_imagenes)
        catalogo.imagen = ",".join(imagenes_actuales)
    db.session.add(catalogo)
    db.session.commit()

    return redirect(url_for('catalogo'))

@app.get('/eliminar_moto/<id_moto>')
@login_required
def eliminar_moto(id_moto):
    catalogo = tbl_catal_motos.query.get(id_moto)

    if not catalogo:
        flash('El moto no existe', 'error')
        return redirect(url_for('catalogo'))

    # Realizar la eliminación del catalogo
    db.session.delete(catalogo)
    db.session.commit()

    flash('Auto eliminado exitosamente', 'success')
    return redirect(url_for('catalogo_motos '))

@app.post('/actualizar_moto/<id_moto>/post')
def actualizar_moto(id_moto):
    catalogo = tbl_catal_motos.query.get(id_moto)
    act_modelo_moto = request.form['act_modelo_moto']
    act_año_moto = request.form['act_año_moto']
    act_gasolina = request.form['act_gasolina']
    act_transmision = request.form['act_transmision']
    act_marca = request.form['act_marca']
    act_descripcion = request.form['act_descripcion']

    
    if act_modelo_moto != None and act_modelo_moto != '':
        catalogo_motos.modelo_moto = act_modelo_moto
        
    if act_año_moto != None and act_año_moto != '':
        catalogo_motos.año_moto= act_año_moto        
    
    if act_gasolina != None and act_gasolina != '':
        catalogo_motos.gasolina = act_gasolina
    
    if act_transmision != None and act_transmision != '':
        catalogo_motos.trasmision = act_transmision
    
    if act_marca != None and act_marca != '':
        catalogo_motos.marca = act_marca
    
    if act_descripcion != None and act_descripcion != '':
        catalogo_motos.descipcion = act_descripcion
        
    nuevas_imagenes = request.files.getlist('act_imagen')

    nombres_nuevas_imagenes = [] 

    for nueva_imagen in nuevas_imagenes:
        if nueva_imagen and allowed_file(nueva_imagen.filename):
            nuevo_nombre = secure_filename(nueva_imagen.filename)
            nueva_ruta = os.path.join(app.config['UPLOAD_FOLDER_2'], nuevo_nombre)
            nueva_imagen.save(nueva_ruta)
            nombres_nuevas_imagenes.append(nuevo_nombre)

    if nombres_nuevas_imagenes:
        imagenes_actuales = catalogo.imagen.split(",") if catalogo.imagen else []
        imagenes_actuales.extend(nombres_nuevas_imagenes)
        catalogo.imagen = ",".join(imagenes_actuales)
    db.session.add(catalogo)
    db.session.commit()

    return redirect(url_for('catalogo'))

    
@app.post('/subir_carrusel')
@login_required
def subir_carrusel():
    if request.method == 'POST':

        # Obtener la imagen del request.files
        imagen = request.files['imagen']

        if imagen and allowed_file(imagen.filename):  # Verificar si se ha subido un archivo y si es del tipo permitido
            filename = secure_filename(imagen.filename)  # Obtener el nombre del archivo
            ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)  # Crear la ruta del archivo
            

            imagen.save(ruta)  # Guardar la imagen en el directorio designado

            # Crea un nuevo objeto de tbl_catal_autos con los datos recibidos, incluyendo la ruta de la imagen
            nueva_imagen = tbl_carrusel(
                
                imagen=filename  # Almacena el nombre del archivo en la base de datos
            )

            db.session.add(nueva_imagen)
            db.session.commit()

            flash('Nuevo auto agregado con éxito', 'success')
            return redirect(url_for('catalogo'))  # Redirige a donde sea necesario después de agregar el auto
        else:
            flash('Error al subir la imagen', 'error')
            return redirect(url_for('catalogo'))
    else:
        flash('Error al agregar el auto', 'error')
        return redirect(url_for('catalogo'))

#Ruta para el Crud de Motos
@app.get('/catalogo_motos')
@login_required
def catalogo_motos():
    admin = tbl_admin.query.get(session['administrador_id'])
    catalogo = tbl_catal_motos.query.all()
    return render_template('admin/catalogo_motos.html', catalogo=catalogo, admin=admin)

@app.post('/agregar_moto')
def agregar_moto():
    if request.method == 'POST':
        modelo_moto = request.form['modelo_moto']
        año_moto = request.form['año_moto']
        gasolina = request.form['gasolina']
        trasmision = request.form['trasmision']
        marca = request.form['marca']
        descripcion = request.form['descripcion']
        precio_lista = request.form['precio_lista']
        precio_inicial = request.form['precio_inicial']

        imagen = request.files.getlist('imagen')

        nombres_imagenes = [] 

        for imagen in imagen:
            if imagen and allowed_file(imagen.filename):
                filename = secure_filename(imagen.filename)
                ruta = os.path.join(app.config['UPLOAD_FOLDER_3'], filename)
                imagen.save(ruta)
                nombres_imagenes.append(filename)  

        imagenes_str = ",".join(nombres_imagenes)

        nueva_moto = tbl_catal_motos(
            modelo_moto=modelo_moto,
            año_moto=año_moto,
            gasolina=gasolina,
            trasmision=trasmision,
            marca=marca,
            descripcion=descripcion,
            precio_inicial=precio_inicial,
            precio_lista=precio_lista,
            imagen=imagenes_str 
        )

        db.session.add(nueva_moto)
        db.session.commit()

        flash('Nuevo auto agregado con éxito', 'success')
        return redirect(url_for('catalogo'))     
    else:
        flash('Error al agregar el auto', 'error')
        return redirect(url_for('catalogo'))
    
#cotizaciones
@app.post('/cotizacion_auto')
def cotizacion_auto():
    if request.method == 'POST':
        modelo_coti_auto = request.form['modelo_coti_auto']
        año_coti_auto = request.form['año_coti_auto']
        nombre_coti_auto = request.form['nombre_coti_auto']
        ap_coti_auto = request.form['ap_coti_auto']
        am_coti_auto = request.form['am_coti_auto']
        celular_coti_auto = request.form['celular_coti_auto']
        correo_coti_auto = request.form['correo_coti_auto']
        fecha_coti = datetime.utcnow().date()

        

        # Crea un nuevo objeto tbl_catal_autos con los datos recibidos, incluyendo la cadena de imágenes
        coti_auto = tbl_coti_autos(
            
            modelo_coti_auto=modelo_coti_auto,
            año_coti_auto=año_coti_auto,
            nombre_coti_auto=nombre_coti_auto,
            ap_coti_auto=ap_coti_auto,
            am_coti_auto=am_coti_auto,
            celular_coti_auto=celular_coti_auto,
            correo_coti_auto=correo_coti_auto,
            fecha_coti=fecha_coti  # Agrega la fecha de cotización al objeto
    
        )

        db.session.add(coti_auto)
        db.session.commit()

        flash('Nuevo auto agregado con éxito', 'success')
        return redirect(url_for('catalogo_auto'))     
    else:
        flash('Error al agregar el auto', 'error')
        return redirect(url_for('catalogo_auto'))

@app.post('/cotizacion_moto')
def cotizacion_moto():
    if request.method == 'POST':
        modelo_coti_moto = request.form['modelo_coti_moto']
        año_coti_moto = request.form['año_coti_moto']
        nombre_comp = request.form['nombre_comp']
        ap_coti_moto = request.form['ap_coti_moto']
        am_coti_moto = request.form['am_coti_moto']
        celular_coti_moto = request.form['celular_coti_moto']
        correo_coti_moto = request.form['correo_coti_moto']
        fecha_coti = datetime.utcnow().date()

        

        # Crea un nuevo objeto tbl_catal_autos con los datos recibidos, incluyendo la cadena de imágenes
        coti_moto = tbl_coti_motos(
            modelo_coti_moto=modelo_coti_moto,
            año_coti_moto=año_coti_moto,
            nombre_comp=nombre_comp,
            ap_coti_moto=ap_coti_moto,
            am_coti_moto=am_coti_moto,
            celular_coti_moto=celular_coti_moto,
            correo_coti_moto=correo_coti_moto,
            fecha_coti=fecha_coti  # Agrega la fecha de cotización al objeto

            
        )

        db.session.add(coti_moto)
        db.session.commit()

        flash('Nuea moto agregada agregado con éxito', 'success')
        return redirect(url_for('catalogo_moto'))     
    else:
        flash('Error al agregar la mto', 'error')
        return redirect(url_for('catalogo_moto'))

#Ruta para las corizaciones

#Cotizacion de autos

@app.get('/cotizacion_autos')
@login_required
def cotizacion_autos():
    admin = tbl_admin.query.get(session['administrador_id'])
    cotizacion_auto = tbl_coti_autos.query.order_by(tbl_coti_autos.id_coti_auto.desc()).all()
    return render_template('admin/cotizaciones_autos.html', cotizacion_auto=cotizacion_auto,  admin=admin)

#Eliminacion de cotizacion moto
@app.get('/eliminar_cotizacion_auto/<id_coti_auto>')
@login_required
def eliminar_cotizacion_auto(id_coti_auto):
    cotizacion_auto = tbl_coti_autos.query.get(id_coti_auto)

    if not cotizacion_auto:
        flash('El auto no existe', 'error')
        return redirect(url_for('cotizacion_auto'))

    # Realizar la eliminación del cotizacion_auto
    db.session.delete(cotizacion_auto)
    db.session.commit()

    flash('Auto eliminado exitosamente', 'success')
    return redirect(url_for('cotizacion_autos'))


#Cotizacion de motos
@app.get('/cotizacion_motos')
@login_required
def cotizacion_motos():
    admin = tbl_admin.query.get(session['administrador_id'])
    cotizacion_moto = tbl_coti_motos.query.order_by(tbl_coti_motos.id_coti_moto.desc()).all()
    return render_template('admin/cotizaciones_motos.html', cotizacion_moto=cotizacion_moto,  admin=admin)

#Eliminar cotizacion moto
@app.get('/eliminar_cotizacion_moto/<id_coti_moto>')
@login_required
def eliminar_cotizacion_moto(id_coti_moto):
    cotizacion_moto = tbl_coti_motos.query.get(id_coti_moto)

    if not cotizacion_moto:
        flash('El auto no existe', 'error')
        return redirect(url_for('cotizacion_motos'))

    # Realizar la eliminación del cotizacion_auto
    db.session.delete(cotizacion_moto)
    db.session.commit()

    flash('Auto eliminado exitosamente', 'success')
    return redirect(url_for('cotizacion_motos'))



@app.route('/graficas')
def graficas():
    admin = tbl_admin.query.get(session['administrador_id'])

    cotizaciones_por_dia_autos = (
        db.session.query(
            db.func.DATE(tbl_coti_autos.fecha_coti).label('dia'),
            db.func.count(tbl_coti_autos.id_coti_auto).label('total_cotizaciones')
        )
        .group_by('dia')
        .order_by('dia')
        .all()
    )

    dias_autos = [cotizacion.dia for cotizacion in cotizaciones_por_dia_autos]
    total_cotizaciones_por_dia_autos = [cotizacion.total_cotizaciones for cotizacion in cotizaciones_por_dia_autos]

    fig_lineas_autos = px.line(x=dias_autos, y=total_cotizaciones_por_dia_autos, labels={'x': 'Día', 'y': 'Total de Cotizaciones por Día'})

    fig_lineas_autos.update_layout(xaxis=dict(type='category', fixedrange=True), yaxis=dict(fixedrange=True))

    graph_lineas_autos = fig_lineas_autos.to_html(full_html=False, config={'displayModeBar': False})

    modelos_cotizados_autos = (
        db.session.query(
            tbl_coti_autos.modelo_coti_auto,
            db.func.count(tbl_coti_autos.id_coti_auto).label('total_cotizaciones')
        )
        .group_by(tbl_coti_autos.modelo_coti_auto)
        .order_by(db.desc('total_cotizaciones'))
        .all()
    )

    modelos_autos = [modelo[0] for modelo in modelos_cotizados_autos]
    cotizaciones_autos = [modelo[1] for modelo in modelos_cotizados_autos]

    modelos_barras_autos = modelos_autos[:4]
    cotizaciones_barras_autos = cotizaciones_autos[:4]

    fig_autos = px.bar(x=modelos_barras_autos, y=cotizaciones_barras_autos, labels={'x': 'Modelo Auto', 'y': 'Total de Cotizaciones Autos'})

    cotizaciones_por_mes_autos = (
        db.session.query(
            db.func.MONTH(tbl_coti_autos.fecha_coti).label('mes'),
            db.func.count(tbl_coti_autos.id_coti_auto).label('total_cotizaciones')
        )
        .group_by('mes')
        .order_by('mes')
        .all()
    )

    meses_autos = [calendar.month_name[cotizacion.mes] for cotizacion in cotizaciones_por_mes_autos]

    nombre_mes_actual_autos = calendar.month_name[datetime.now().month]

    fig_pastel_autos = px.pie(
        names=meses_autos,
        values=[cotizacion.total_cotizaciones for cotizacion in cotizaciones_por_mes_autos],
        title=f'Distribución de Cotizaciones de Autos de {nombre_mes_actual_autos}'
    )

    graph_autos = fig_autos.to_html(full_html=False, config={'displayModeBar': False})
    graph_pastel_autos = fig_pastel_autos.to_html(full_html=False, config={'displayModeBar': False})

    cotizaciones_por_dia_motos = (
        db.session.query(
            db.func.DATE(tbl_coti_motos.fecha_coti).label('dia'),
            db.func.count(tbl_coti_motos.id_coti_moto).label('total_cotizaciones')
        )
        .group_by('dia')
        .order_by('dia')
        .all()
    )

    dias_motos = [cotizacion.dia for cotizacion in cotizaciones_por_dia_motos]
    total_cotizaciones_por_dia_motos = [cotizacion.total_cotizaciones for cotizacion in cotizaciones_por_dia_motos]

    fig_lineas_motos = px.line(x=dias_motos, y=total_cotizaciones_por_dia_motos, labels={'x': 'Día', 'y': 'Total de Cotizaciones por Día'})

    fig_lineas_motos.update_layout(xaxis=dict(type='category', fixedrange=True), yaxis=dict(fixedrange=True))

    graph_lineas_motos = fig_lineas_motos.to_html(full_html=False, config={'displayModeBar': False})

    modelos_cotizados_motos = (
        db.session.query(
            tbl_coti_motos.modelo_coti_moto,
            db.func.count(tbl_coti_motos.id_coti_moto).label('total_cotizaciones')
        )
        .group_by(tbl_coti_motos.modelo_coti_moto)
        .order_by(db.desc('total_cotizaciones'))
        .limit(4)
        .all()
    )

    modelos_motos = [modelo[0] for modelo in modelos_cotizados_motos]
    cotizaciones_motos = [modelo[1] for modelo in modelos_cotizados_motos]

    modelos_barras_motos = modelos_motos[:4]
    cotizaciones_barras_motos = cotizaciones_motos[:4]

    fig_motos = px.bar(x=modelos_barras_motos, y=cotizaciones_barras_motos, labels={'x': 'Modelo Moto', 'y': 'Total de Cotizaciones Motos'})

    cotizaciones_por_mes_motos = (
        db.session.query(
            db.func.MONTH(tbl_coti_motos.fecha_coti).label('mes'),
            db.func.count(tbl_coti_motos.id_coti_moto).label('total_cotizaciones')
        )
        .group_by('mes')
        .order_by('mes')
        .all()
    )

    meses_motos = [calendar.month_name[cotizacion.mes] for cotizacion in cotizaciones_por_mes_motos]

    # Obtener el nombre del mes actual en español
    nombre_mes_actual_motos = calendar.month_name[datetime.now().month]

    # Crear gráfica de pastel para motos con etiquetas personalizadas
    fig_pastel_motos = px.pie(
        names=meses_motos,
        values=[cotizacion.total_cotizaciones for cotizacion in cotizaciones_por_mes_motos],
        title=f'Distribución de Cotizaciones de Motos de {nombre_mes_actual_motos}'
    )

    # Configurar la visualización para ocultar la barra de herramientas
    graph_motos = fig_motos.to_html(full_html=False, config={'displayModeBar': False})
    graph_pastel_motos = fig_pastel_motos.to_html(full_html=False, config={'displayModeBar': False})

    return render_template('admin/graficas.html', admin=admin, graph_lineas_autos=graph_lineas_autos, graph_autos=graph_autos, graph_pastel_autos=graph_pastel_autos, graph_lineas_motos=graph_lineas_motos, graph_motos=graph_motos, graph_pastel_motos=graph_pastel_motos)


@app.route('/get_cotizaciones', methods=['GET'])
def get_cotizaciones():
    autos_con_mayor_cotizacion = tbl_coti_autos.query.order_by(tbl_coti_autos.fecha_coti.desc()).limit(5).all()
    
    # Crear una lista de diccionarios con los datos relevantes
    data = [
        {
            'modelo_coti_auto': auto.modelo_coti_auto,
            'fecha_coti': auto.fecha_coti.isoformat()  # Convertir a formato ISO para JavaScript
        }
        for auto in autos_con_mayor_cotizacion
    ]

    return jsonify(data)
#Actualización de perfil
@app.route('/perfil_admin', methods=['GET'])
def perfil_admin():
    admin = tbl_admin.query.get(session['administrador_id'])

    return render_template('admin/perfil_admin.html', admin=admin)
@app.post('/admin_act/<id_admin>')
def admin_act(id_admin):
    admin = tbl_admin.query.get(id_admin)
    
    # Obtener datos del formulario
    act_nombre_admin = request.form['act_nombre_admin']
    act_ap_admin = request.form['act_ap_admin']
    act_am_admin = request.form['act_am_admin']
    act_n_empleado = request.form['act_n_empleado']
    act_psw = request.form['act_psw']
    act_correo = request.form['act_correo']
    act_puesto = request.form['act_puesto']

    # Actualizar campos si se proporcionan valores válidos
    if act_nombre_admin:
        admin.nombre_admin = act_nombre_admin

    if act_ap_admin:
        admin.ap_admin = act_ap_admin

    if act_am_admin:
        admin.am_admin = act_am_admin

    if act_n_empleado:
        admin.n_empleado = act_n_empleado

    if act_psw:
        admin.psw = act_psw

    if act_correo:
        admin.correo = act_correo

    if act_puesto:
        admin.puesto = act_puesto

    # Procesar la imagen
    nueva_imagen = request.files['act_imagen']

    if nueva_imagen and allowed_file(nueva_imagen.filename):
        nuevo_nombre = secure_filename(nueva_imagen.filename)
        nueva_ruta = os.path.join(app.config['UPLOAD_FOLDER_4'], nuevo_nombre)
        nueva_imagen.save(nueva_ruta)

        # Actualizar el campo de imagen en la base de datos
        admin.imagen = nuevo_nombre

    db.session.add(admin)
    db.session.commit()
    try:
        db.session.commit()
        flash('Actualización exitosa', 'success')  # Agrega un mensaje flash para éxito
    except:
        db.session.rollback()
        flash('Error al actualizar. Inténtalo de nuevo.', 'error')  # Agrega un mensaje flash para error

    return redirect(url_for('perfil_admin'))

#Vista de los administradores
@app.route('/administradores', methods=['GET'])
def administradores():
    admin = tbl_admin.query.get(session['administrador_id'] )
    consulta_administradores = tbl_admin.query.all()
    return render_template('admin/gestion_administradores.html', admin=admin, consulta_administradores=consulta_administradores)

#Registro de administrador
@app.route('/reg_admin', methods=['POST'])
def reg_admin():
    if request.method == 'POST':
        nombre_admin = request.form['nombre_admin']
        ap_admin = request.form['ap_admin']
        am_admin = request.form['am_admin']
        n_empleado = request.form['n_empleado']
        psw = request.form['psw']
        correo = request.form['correo']
        puesto = request.form['puesto']

        imagen = request.files['imagen']
        if imagen:
            imagen.save(app.config['UPLOAD_FOLDER_4'] + '/' + imagen.filename)
            imagen_path = 'administradores/' + imagen.filename
        else:
            imagen_path = None

        nuevo_admin = tbl_admin(
            nombre_admin=nombre_admin,
            ap_admin=ap_admin,
            am_admin=am_admin,
            n_empleado=n_empleado,
            psw=psw,
            correo=correo,
            puesto=puesto,
            imagen=imagen_path  
        )

        db.session.add(nuevo_admin)
        db.session.commit()

        flash('Nuevo administrador agregado con éxito', 'success')
        return redirect(url_for('administradores'))     
    else:
        flash('Error al agregar el administrador', 'error')
        return redirect(url_for('administradores'))


@app.get('/eliminar_admin/<id_admin>')
@login_required
def eliminar_admin(id_admin):
    consulta_administradores = tbl_admin.query.get(id_admin)

    if not cotizacion_auto:
        flash('El auto no existe', 'error')
        return redirect(url_for('administradores'))

    # Realizar la eliminación del cotizacion_auto
    db.session.delete(consulta_administradores)
    db.session.commit()

    flash('Auto eliminado exitosamente', 'success')
    return redirect(url_for('administradores'))


if __name__ == '__main__':
    app.secret_key = 'jfjfi029832rninf 2infiwenf2j ienfkowenf92h okenfi20'
    app.run("0.0.0.0", 8080, debug=True)
    