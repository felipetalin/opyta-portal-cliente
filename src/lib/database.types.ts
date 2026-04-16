export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      projetos: {
        Row: {
          codigo_interno_opyta: string | null
          data_fim_prevista: string | null
          data_fim_real: string | null
          data_inicio: string | null
          descricao_projeto: string | null
          id_analista: number | null
          id_cliente: number
          id_projeto: number
          local_projeto: string | null
          nome_projeto: string
          status_projeto: string | null
        }
        Insert: {
          codigo_interno_opyta?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao_projeto?: string | null
          id_analista?: number | null
          id_cliente: number
          id_projeto?: number
          local_projeto?: string | null
          nome_projeto: string
          status_projeto?: string | null
        }
        Update: {
          codigo_interno_opyta?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao_projeto?: string | null
          id_analista?: number | null
          id_cliente?: number
          id_projeto?: number
          local_projeto?: string | null
          nome_projeto?: string
          status_projeto?: string | null
        }
        Relationships: []
      }
      pontos_coleta: {
        Row: {
          bacia_hidrografica: string | null
          curso_d_agua: string | null
          data_hora_coleta: string
          id_analista: number | null
          id_campanha: number | null
          id_empreendimento: number | null
          id_ponto_coleta: number
          id_projeto: number
          latitude: number | null
          longitude: number | null
          municipio: string | null
          nome_ponto: string | null
          observacoes: string | null
          tipo_coleta: string | null
        }
        Insert: {
          bacia_hidrografica?: string | null
          curso_d_agua?: string | null
          data_hora_coleta: string
          id_analista?: number | null
          id_campanha?: number | null
          id_empreendimento?: number | null
          id_ponto_coleta?: number
          id_projeto: number
          latitude?: number | null
          longitude?: number | null
          municipio?: string | null
          nome_ponto?: string | null
          observacoes?: string | null
          tipo_coleta?: string | null
        }
        Update: {
          bacia_hidrografica?: string | null
          curso_d_agua?: string | null
          data_hora_coleta?: string
          id_analista?: number | null
          id_campanha?: number | null
          id_empreendimento?: number | null
          id_ponto_coleta?: number
          id_projeto?: number
          latitude?: number | null
          longitude?: number | null
          municipio?: string | null
          nome_ponto?: string | null
          observacoes?: string | null
          tipo_coleta?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cnpj: string | null
          contato_principal: string | null
          email: string | null
          id_cliente: number
          nome_empresa: string
          telefone: string | null
        }
        Insert: {
          cnpj?: string | null
          contato_principal?: string | null
          email?: string | null
          id_cliente?: number
          nome_empresa: string
          telefone?: string | null
        }
        Update: {
          cnpj?: string | null
          contato_principal?: string | null
          email?: string | null
          id_cliente?: number
          nome_empresa?: string
          telefone?: string | null
        }
        Relationships: []
      }
      usuario_projetos: {
        Row: {
          id: string
          id_usuario: string
          id_projeto: number
          criado_em: string | null
        }
        Insert: {
          id?: string
          id_usuario: string
          id_projeto: number
          criado_em?: string | null
        }
        Update: {
          id?: string
          id_usuario?: string
          id_projeto?: number
          criado_em?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vw_geo_biota: {
        Row: {
          biomassa: number | null
          campanha: string | null
          contagem: number | null
          data_hora_coleta: string | null
          grupo_biologico: string | null
          latitude: number | null
          longitude: number | null
          nome_cientifico: string | null
          ponto: string | null
          projeto: string | null
        }
      }
      vw_geo_fisico: {
        Row: {
          campanha: string | null
          data_hora_coleta: string | null
          latitude: number | null
          longitude: number | null
          nome_parametro: string | null
          ponto: string | null
          projeto: string | null
          unidade_medida: string | null
          valor_medido: number | null
        }
      }
    }
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
