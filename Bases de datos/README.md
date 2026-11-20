# Manizales data download

`download_manizales_data.py` downloads the authorized municipality slice from
Socrata dataset `ab8a-uwf7` and writes deterministic CSV and JSON files.

The compatible endpoint is the public Socrata v2 resource API:
`https://www.datos.gov.co/resource/ab8a-uwf7.json`. The supplied `/api/v3/views/.../query.json`
URL requires authentication for direct access, so this downloader uses the
public resource endpoint instead.

The request selects exactly `cod_mpio,zona,llave,corte,hogar,fex,hog001` through
`hog027` and filters `cod_mpio='17001'`. Results are paginated, checked for the
municipality and all required fields, and retried only for transient HTTP or
transport failures. Records are sorted before writing so repeated downloads
produce stable output ordering.

## Usage

From the repository root, with Python 3 and no third-party dependencies:

```sh
python3 "Bases de datos/download_manizales_data.py"
```

Use `--csv`, `--json`, `--page-size`, `--timeout`, and `--retries` to override
the output paths or bounded request settings. Generated files are ignored by
Git because downloaded household records must not be committed accidentally.
No real records are included in this repository.
