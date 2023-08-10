import { useState } from "react";
import "./PokeCard.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useDescription } from "../controllers/SearchPokemon";

const PokeCard = ({ index, pokemon, deletePokecb, shiftPokemonLeftcb, shiftPokemonRightcb }) => {
  const { isLoading, data } = useDescription(pokemon.pokeDescriptionURL);
  const description = data;

  return (
    <Card className="root">
      <CardContent>
        <PokemonImage pokeImg={pokemon.pokeImg} pokeName={pokemon.pokeName} />
        <Typography style={{ textAlign: "center" }} variant="h5" component="h2">
          {pokemon.pokeName}
        </Typography>
        <PokemonDescription description={description} isLoading={isLoading} />
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        <ButtonGroup
          index={index}
          deletePokecb={deletePokecb}
          shiftPokemonLeftcb={shiftPokemonLeftcb}
          shiftPokemonRightcb={shiftPokemonRightcb}
        />
      </CardActions>
    </Card>
  );
};

const PokemonImage = ({ pokeImg, pokeName }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      {!loaded ? <Skeleton animation="wave" variant="rect" width={300} height={300} /> : null}
      <img
        style={loaded ? { width: 300, height: 300 } : { display: "none" }}
        src={pokeImg}
        alt={pokeName}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const PokemonDescription = ({ description, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" width="60%" />
        </div>
      ) : (
        <Typography style={{ height: 200 }} variant="body2" component="p">
          {description}
        </Typography>
      )}
    </>
  );
};

const ButtonGroup = ({ index, deletePokecb, shiftPokemonLeftcb, shiftPokemonRightcb }) => {
  return (
    <>
      <IconButton
        onClick={() => {
          shiftPokemonLeftcb(index);
        }}
        color="primary"
        aria-label="left move card"
        component="span"
      >
        <ArrowBackIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          deletePokecb(index);
        }}
        color="primary"
        aria-label="delete card"
        component="span"
      >
        <DeleteOutlineIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          shiftPokemonRightcb(index);
        }}
        color="primary"
        aria-label="right move card"
        component="span"
      >
        <ArrowForwardIcon />
      </IconButton>
    </>
  );
};

export default PokeCard;
