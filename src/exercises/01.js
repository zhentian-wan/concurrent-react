import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {PokemonDataView, ErrorBoundary} from '../utils'

function createFetch(fetchFn) {
  let status = 'pending'
  let result
  let error
  let promise = fetchFn().then(
    p => {
      console.log('promise resolve')
      status = 'success'
      result = p
    },
    e => {
      status = 'error'
      error = e
    },
  )

  return {
    read() {
      if (status === 'error') {
        throw error
      }

      if (status === 'pending') {
        throw promise // this API might change
      }

      if (status === 'success') {
        return result
      }
    },
  }
}

const promise = createFetch(() => fetchPokemon('pikachu'))

function PokemonInfo() {
  console.log('PokemonInfo init')

  const pokemon = promise.read()

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info">
      <ErrorBoundary>
        <React.Suspense
          fallback={
            console.log('loading pokemon...') && <div>Loading pokemon...</div>
          }
        >
          <PokemonInfo />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
