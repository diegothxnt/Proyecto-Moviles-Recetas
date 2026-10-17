import React, { createContext, useContext, useState, useCallback } from 'react';
import ModalAlerta from '../componentes/ModalAlerta';
import ModalConfirmacion from '../componentes/ModalConfirmacion';
import ModalOpciones from '../componentes/ModalOpciones';

const AlertasContexto = createContext();

export const useAlerta = () => useContext(AlertasContexto);

export const AlertasProvider = ({ children }) => {
  const [alerta, setAlerta] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [opciones, setOpciones] = useState(null);


  const mostrarAlerta = useCallback((titulo, mensaje = '', tipo = 'info') => {
    return new Promise((resolve) => {
      setAlerta({
        titulo,
        mensaje,
        tipo,
        onCerrar: () => {
          setAlerta(null);
          resolve();
        },
      });
    });
  }, []);

  const mostrarConfirmacion = useCallback(
    ({
      titulo,
      mensaje,
      textoConfirmar = 'Confirmar',
      textoCancelar = 'Cancelar',
      tipo = 'advertencia',
    }) => {
      return new Promise((resolve) => {
        setConfirmacion({
          titulo,
          mensaje,
          textoConfirmar,
          textoCancelar,
          tipo,
          onConfirmar: () => {
            setConfirmacion(null);
            resolve(true);
          },
          onCancelar: () => {
            setConfirmacion(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  const mostrarOpciones = useCallback(({ titulo, subtitulo, opciones = [] }) => {
    setOpciones({
      titulo,
      subtitulo,
      opciones,
      onCancelar: () => setOpciones(null),
    });
  }, []);

  return (
    <AlertasContexto.Provider
      value={{ mostrarAlerta, mostrarConfirmacion, mostrarOpciones }}
    >
      {children}

      {alerta && (
        <ModalAlerta
          visible
          titulo={alerta.titulo}
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
          onCerrar={alerta.onCerrar}
        />
      )}

      {confirmacion && (
        <ModalConfirmacion
          visible
          titulo={confirmacion.titulo}
          mensaje={confirmacion.mensaje}
          textoConfirmar={confirmacion.textoConfirmar}
          textoCancelar={confirmacion.textoCancelar}
          tipo={confirmacion.tipo}
          onConfirmar={confirmacion.onConfirmar}
          onCancelar={confirmacion.onCancelar}
        />
      )}

      {opciones && (
        <ModalOpciones
          visible
          titulo={opciones.titulo}
          subtitulo={opciones.subtitulo}
          opciones={opciones.opciones}
          onCancelar={opciones.onCancelar}
        />
      )}
    </AlertasContexto.Provider>
  );
};