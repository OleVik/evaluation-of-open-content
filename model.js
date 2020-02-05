/**
 * Get value from GET-parameter.
 * @param {string} parameterName GET-query parameter name.
 */
function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

/**
 * Get object keys as an array of integers
 * @param {object} obj Object to get keys from
 */
function getObjectKeysAsIntArray(obj) {
  return Object.keys(obj).map(key => parseInt(key));
}

/**
 * Get maximum value in array
 * @param {array} numArray Numerical array to search
 */
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

/**
 * Get normalized integer
 *
 * Normalizes value by determining its fulfillment of its category,
 * multiplying it by 100 to get a percentage.
 *
 * @param {int} value Value to normalize
 * @param {int} max Maximum value from available values
 */
function getNormalizedInt(value, max) {
  return Math.round((value / max) * 100);
}

/**
 * Get average value from array of integers
 * @param {array} arr Array of integers
 */
function getArrayAverage(arr) {
  var sum = 0;
  for (var i in arr) {
    sum += arr[i];
  }
  var numbersCnt = arr.length;
  return sum / numbersCnt;
}

/**
 * Normalizes all data in object
 * @param {object} data Data to normalize
 * @param {object} labels Set of values and labels
 */
function normalizeData(data, labels) {
  const normalizedData = {};
  for (const medium in data) {
    normalizedData[medium] = { label: data[medium].label, values: {} };
    for (let [category, subcategories] of Object.entries(data[medium].values)) {
      normalizedData[medium]["values"][category] = {};
      for (let [subcategory, value] of Object.entries(subcategories)) {
        if (
          labels.hasOwnProperty(category) &&
          labels[category].hasOwnProperty("items") &&
          labels[category]["items"].hasOwnProperty(subcategory) &&
          labels[category]["items"][subcategory].hasOwnProperty("values")
        ) {
          const max = getMaxOfArray(
            getObjectKeysAsIntArray(
              labels[category]["items"][subcategory]["values"]
            )
          );
          normalizedData[medium]["values"][category][
            subcategory
          ] = getNormalizedInt(value, max);
        }
      }
    }
  }
  return normalizedData;
}

/**
 * Sets an average value for each category
 * @param {object} data Data to average
 */
function averageDataCategories(data) {
  const averagedData = {};
  for (const medium in data) {
    averagedData[medium] = { label: data[medium].label, values: {} };
    for (let [category, subcategories] of Object.entries(data[medium].values)) {
      let values = [];
      for (let [subcategory, value] of Object.entries(subcategories)) {
        values.push(value);
      }
      averagedData[medium]["values"][category] = Math.round(
        getArrayAverage(values)
      );
    }
  }
  return averagedData;
}

/**
 * Reassembles data for use with Charts.js
 * @param {string} lang Language-code
 * @param {object} data Data to assemble
 */
function assembleDatasets(lang, data) {
  let datasets = [];
  for (const medium in data) {
    const dataset = {};
    dataset.label = data[medium].label[lang] || data[medium].label;
    dataset.data = Object.values(data[medium]["values"]);
    datasets.push(dataset);
  }
  return datasets;
}

/**
 * Add HTML-element
 * @param {string} element HTML-element to add
 * @param {string} content InnerHTML-content of element
 * @param {HTMLElement} parent Handle of parent element
 * @param {int} colspan Value of "colspan"-attribute, optional
 * @param {string} scope Value of "scope"-attribute, optional
 * @param {string} tip Value of "data-tippy-content"-attribute, optional
 * @param {string} style Value of "style"-attribute, optional
 */
function addElement(
  element,
  content,
  parent,
  colspan = 0,
  scope = "",
  tip = "",
  style = ""
) {
  let add = document.createElement(element);
  add.textContent = content;
  if (colspan > 0) {
    add.colSpan = colspan;
  }
  if (scope !== "") {
    add.scope = scope;
  }
  if (tip !== "") {
    let attr = document.createAttribute("data-tippy-content");
    attr.value = tip;
    add.setAttributeNode(attr);
  }
  if (style !== "") {
    add.setAttribute("style", style);
  }
  parent.appendChild(add);
}

/**
 * Populate "table"-element with headers
 * @param {string} element Target-selector of HTML-table
 * @param {object} labels Set of values and labels
 */
function buildTable(element, labels) {
  const table = document.querySelector(element);
  let tableHeader = table.createTHead();
  let categoryHeaders = tableHeader.insertRow();
  let subcategoryHeaders = tableHeader.insertRow();
  addElement("th", "", categoryHeaders);
  addElement("th", "", subcategoryHeaders);
  for (const category in labels) {
    addElement(
      "th",
      labels[category].label,
      categoryHeaders,
      Object.keys(labels[category].items).length,
      "col"
    );
    for (const subcategory in labels[category].items) {
      addElement(
        "th",
        labels[category]["items"][subcategory].label,
        subcategoryHeaders,
        0,
        "col"
      );
    }
  }
  return table;
}

/**
 * Populate "table"-element with content
 * @param {string} lang Language-code
 * @param {HTMLBodyElement} tableBody Body-element of table
 * @param {object} data Data to insert
 * @param {object} normalizedData Normalized data to insert
 * @param {object} averagedData Averaged data to insert
 * @param {object} labels Set of values and labels
 */
function fillTable(
  lang,
  tableBody,
  data,
  normalizedData,
  averagedData,
  labels
) {
  for (const medium in data) {
    let mediaDataRow = tableBody.insertRow();
    let tip = `<strong>${labels.generic.average}</strong><br />`;
    for (let [category, value] of Object.entries(
      averagedData[medium]["values"]
    )) {
      if (
        labels.factors.hasOwnProperty(category) &&
        labels.factors[category].hasOwnProperty("label")
      ) {
        tip += `${labels.factors[category].label}: ${value} <br />`;
      }
    }
    addElement(
      "th",
      data[medium].label[lang] || data[medium].label,
      mediaDataRow,
      0,
      "col",
      tip
    );
    for (const category in data[medium].values) {
      for (let [subcategory, value] of Object.entries(
        data[medium]["values"][category]
      )) {
        if (
          labels.factors.hasOwnProperty(category) &&
          labels.factors[category].hasOwnProperty("items") &&
          labels.factors[category]["items"].hasOwnProperty(subcategory) &&
          labels.factors[category]["items"][subcategory].hasOwnProperty(
            "values"
          )
        ) {
          addElement(
            "td",
            `${normalizedData[medium]["values"][category][subcategory]} (${value})`,
            mediaDataRow,
            0,
            "",
            labels.factors[category]["items"][subcategory]["values"][value]
          );
        }
      }
    }
  }
}

function generateReadme(labels) {
  var readme = `# ${labels.generic.title}\n\n`;
  readme += `${labels.generic.description}\n\n`;
  readme += `## ${labels.generic.usage.title}\n\n`;
  readme += `${labels.generic.usage.description}\n\n`;
  readme += `## ${labels.generic.factor}\n\n`;
  for (const category in labels.factors) {
    readme += `### ${labels.factors[category].label}\n\n`;
    readme += `${labels.factors[category].description}\n\n`;
    for (const subcategory in labels.factors[category].items) {
      readme += `#### ${labels.factors[category].items[subcategory].label}\n\n`;
      for (const key in labels.factors[category].items[subcategory].values) {
        readme += `\`${key}\` - ${labels.factors[category].items[subcategory].values[key]}  \n`;
      }
      readme += `\n`;
    }
  }
  return readme;
}

var canvas = document.getElementById("radarChart");
var ctx = canvas.getContext("2d");
Chart.defaults.global.defaultFontColor = "black";
Chart.defaults.global.defaultFontSize = 16;

var labels = {
  en: {
    generic: {
      title:
        "Multilingual rubric for evaluation of development of open content",
      description:
        "A simple framework for comparing the explicit and implicit cost of developing, and relative differences between, various types of open content commonly used in eLearning. Inspired by [a rubric from Anstey and Watson (2018)](https://er.educause.edu/articles/2018/9/a-rubric-for-evaluating-e-learning-tools-in-higher-education).\n\nEach type of learning object is given a score based on an evaluation, that is, a rating given to each sub-factor below. The values from these Likert-scales are normalized, aggregated for each factor, and used in a radar-map to indicate the overall and relative complexity between the types.",
      usage: {
        title: "Usage",
        description:
          "Install and run [http-server](https://www.npmjs.com/package/http-server) from the cloned directory, or any other simple server-software, and edit `model.js` as needed. Language is set in the query-parameter `lang` with an ISO 639-1 language-code, `labels` holds all label-data, `data` all types-data.\n\nMIT License 2020 - Ole Vik, NTNU"
      },
      factor: "Factor",
      average: "Average"
    },
    factors: {
      openness: {
        label: "Openness",
        description:
          "Whether the type meets the [OER-specification](http://opencontent.org/definition/), and results in resources that can be processed later, searched for, edited with free tools, and use an open format. A high degree of openness means that the content type is usable, accessible to developers, and to a small degree locked into given systems.",
        items: {
          materials: {
            label: "Materials",
            values: {
              0: "Completely locked",
              1: "Final product is available",
              2: "Involved resources are available",
              3: "Source materials (openly editable) are available"
            }
          },
          retrievable: {
            label: "Retrievable",
            values: {
              0: "Unsearchable",
              1: "Unsearchable, but can include metadata",
              2: "Searchable",
              3: "Searchable, and can include metadata"
            }
          },
          tools: {
            label: "Tools",
            values: {
              0: "Tools are proprietary",
              1: "Tools are free or available via site-licens",
              2: "Tools are open (source)"
            }
          },
          format: {
            label: "Format",
            values: {
              0: "Format is closed and proprietary",
              1: "Format is open to certain software",
              2: "Format is open to a lot of software",
              3: "Format is open and standardized"
            }
          }
        }
      },
      availability: {
        label: "Availability",
        description:
          "The threshold of use for the end-user, where negative aspects such as ridigity, high degree of stimulation, and technical limitations are measured. If the content does not allow the user to control how it is consumed, then this constrains the end-users learning. Involving multiple senses can create engagement, but usually requires more concentration, and there is a danger that the learning is limited by overstimulation.\n\nSome content will also require more technical equipment to use, which raises the threshold. Standards here include accessibility for users with disabilities, including vision, hearing or mechanic maneuverability, as well as whether the content can be [clearly perceived, distinguished, used, understood and interpreted](https://www.w3.org/WAI/fundamentals/accessibility-principles/).",
        items: {
          rigidity: {
            label: "Rigidity",
            values: {
              0: "User cannot control tempo or sequence",
              1: "User can control tempo or sequence with difficulty",
              2: "User can control tempo or sequence"
            }
          },
          stimulation: {
            label: "Stimulation",
            values: {
              1: "Involves sight, hearing, and touch",
              2: "Involves sight and hearing",
              3: "Involves sight"
            }
          },
          technical_limitations: {
            label: "Technical limitations",
            values: {
              1: "Content requires special software or equipment",
              2: "Content requires modern browser or equipment",
              3: "Content can be opened with minimal technical competency"
            }
          },
          standards: {
            label: "Standards",
            values: {
              0: "Practically impossible to comply with standards for accessibility",
              1: "Difficult to comply with standards for accessibility",
              2: "Manageable to comply with standards for accessibility",
              3: "Easy to comply with standards for accessibility"
            }
          }
        }
      },
      development: {
        label: "Development",
        description:
          "Necessary time and expertise necessary to produce the content. Both time and technical competency are relative to other content types, not absolute values.",
        items: {
          time: {
            label: "Time",
            values: {
              1: "Very little",
              2: "Little",
              3: "Medium",
              4: "Much",
              5: "Very much"
            }
          },
          competency: {
            label: "Technical competency",
            values: {
              1: "Very low",
              2: "Low",
              3: "Medium",
              4: "High",
              5: "Very high"
            }
          }
        }
      },
      implementation: {
        label: "Implementation",
        description:
          "How many people are likely necessary to develop the content based on subject-matter experts input, and publish it.",
        items: {
          involvement: {
            label: "Involved",
            values: {
              1: "One",
              2: "Two",
              3: "Three or more"
            }
          }
        }
      }
    }
  },
  nb: {
    generic: {
      title:
        "Flerspråklig rubrikk for evaluering av utviklingen av åpent innhold",
      description:
        "Et enkelt rammeverk for å sammenligne eksplisitt og implisitt kostnad ved utvikling, og relative forskjeller mellom, forskjellige typer åpent innhold typisk bruk i eLæring. Inspirert av en [rubrikk av Anstey og Watson (2018)](https://er.educause.edu/articles/2018/9/a-rubric-for-evaluating-e-learning-tools-in-higher-education).\n\nHvert læringsobjekt gis en poengsum basert på en evaluering, det vil si, en vurdering gitt til hver underlagte faktor nedenfor. Verdiene fra disse Likert-skalaene normaliseres, aggregeres for hver faktor, og brukes i et radarkart for å indikere total og relativ kompleksitet mellom typene.",
      usage: {
        title: "Bruk",
        description:
          "Installer og kjør [http-server](https://www.npmjs.com/package/http-server) fra den nedlastede mappen, eller hvilken som helst annen server-programvare, og rediger `model.js` etter behov. Språk settes i nettleser-parameteret `lang`, `labels` inkluderer data for oversettelse/merkelapper, `data` all data om hvert læringsobjekt.\n\nMIT Lisens 2020 - Ole Vik, NTNU"
      },
      factor: "Faktor",
      average: "Gjennomsnitt"
    },
    factors: {
      openness: {
        label: "Åpenhet",
        description:
          "Hvorvidt typen oppfyller [OER-spesifikasjonen](http://opencontent.org/definition/), og resulterer i ressurser som kan bearbeides senere, søkes opp, redigeres med gratis verktøy, og bruker et åpent format. En høy grad av åpenhet betyr at innholdstypen er anvendelig, tilgjengelig for utviklere, og i liten grad låst til gitte systemer.",
        items: {
          materials: {
            label: "Materiale",
            values: {
              0: "Fullstendig låst",
              1: "Sluttproduktet er tilgjengelig",
              2: "Involverte ressurser er tilgjengelig",
              3: "Kildemateriale (redigerbare ressurser) er tilgjengelig"
            }
          },
          retrievable: {
            label: "Gjenfinnbart",
            values: {
              0: "Kan ikke søkes opp",
              1: "Kan ikke søkes opp, men kan ha metadata",
              2: "Kan søkes opp",
              3: "Kan søkes opp, og ha metadata"
            }
          },
          tools: {
            label: "Verktøy",
            values: {
              0: "Verktøy er proprietære",
              1: "Verktøy er gratis eller tilgjengelig via site-lisens",
              2: "Verktøy er åpne (åpen kildekode)"
            }
          },
          format: {
            label: "Format",
            values: {
              0: "Format er lukket og proprietært",
              1: "Format er åpent for diverse programvare",
              2: "Format er åpent for mye programvare",
              3: "Format er åpent og standardisert"
            }
          }
        }
      },
      availability: {
        label: "Tilgjengelighet",
        description:
          "Terskelen for bruk for sluttbrukeren, hvor negative aspekter som rigiditet, høy grad av stimuli, og tekniske begrensninger måles. Hvis innholdet ikke tillater at brukeren styrer hvordan det konsumeres, så begrenser dette læringseffekten. At flere sanser involveres kan skape engasjement, men krever som regel også mer konsentrasjon, og det er en fare for at læringseffekten begrenses av overstimuli.\n\nNoe innhold vil også kreve mer teknisk utstyr for bruk, som hever terskelen. Standarder inkluderer her tilgjengelighet for brukere med nedsatt funksjonsevne, i form av syn, hørsel eller mekanikk, samt at innholdet [tydelig kan oppfattes, adskilles, anvendes, forstås og tolkes](https://www.w3.org/WAI/fundamentals/accessibility-principles/).",
        items: {
          rigidity: {
            label: "Rigiditet",
            values: {
              0: "Bruker kan ikke endre tempo eller rekkefølge",
              1: "Bruker kan vanskelig styre tempo eller rekkefølge",
              2: "Bruker kan styre tempo og rekkefølge"
            }
          },
          stimulation: {
            label: "Stimuli",
            values: {
              1: "Involverer syn, hørsel og berøring",
              2: "Involverer syn og hørsel",
              3: "Involverer syn"
            }
          },
          technical_limitations: {
            label: "Tekniske begrensninger",
            values: {
              1: "Innholdet krever spesiell programvare eller utstyr",
              2: "Innholdet krever moderne nettleser eller utstyr",
              3: "Innholdet kan åpnes med minimal teknisk kompetanse"
            }
          },
          standards: {
            label: "Standarder",
            values: {
              0: "Praktisk umulig å etterleve standarder for tilgjengelighet",
              1: "Vanskelig å etterleve standarder for tilgjengelighet",
              2: "Overkommelig å etterleve standarder for tilgjengelighet",
              3: "Enkelt å etterleve standarder for tilgjengelighet"
            }
          }
        }
      },
      development: {
        label: "Utvikling",
        description:
          "Nødvendig tid og kompetanse nødvendig for å produsere innholdet. Både tid og teknisk kompetanse er her relativt til andre innholdstyper, ikke absolutte verdier.",
        items: {
          time: {
            label: "Tid",
            values: {
              1: "Svært lite",
              2: "Lite",
              3: "Middels",
              4: "Mye",
              5: "Svært mye"
            }
          },
          competency: {
            label: "Tekniske kompetanse",
            values: {
              1: "Svært lav",
              2: "Lav",
              3: "Middels",
              4: "Høy",
              5: "Svært høy"
            }
          }
        }
      },
      implementation: {
        label: "Implementering",
        description:
          "Hvor mange personer som antageligvis må bidra for å utvikle innholdet basert på fageksperters innspill, og publisere det.",
        items: {
          involvement: {
            label: "Involverte",
            values: {
              1: "Én",
              2: "To",
              3: "Tre eller flere"
            }
          }
        }
      }
    }
  }
};

const data = {
  text: {
    label: {
      en: "Text",
      nb: "Tekst"
    },
    values: {
      openness: {
        materials: 3,
        retrievable: 3,
        tools: 2,
        format: 3
      },
      availability: {
        rigidity: 2,
        technical_limitations: 3,
        stimulation: 3,
        standards: 3
      },
      development: {
        time: 1,
        competency: 1
      },
      implementation: {
        involvement: 1
      }
    }
  },
  images: {
    label: {
      en: "Images",
      nb: "Bilder"
    },
    values: {
      openness: {
        materials: 3,
        retrievable: 0,
        tools: 2,
        format: 3
      },
      availability: {
        rigidity: 2,
        technical_limitations: 3,
        stimulation: 3,
        standards: 2
      },
      development: {
        time: 1,
        competency: 2
      },
      implementation: {
        involvement: 1
      }
    }
  },
  audio: {
    label: "Audio",
    values: {
      openness: {
        materials: 2,
        retrievable: 0,
        tools: 2,
        format: 3
      },
      availability: {
        rigidity: 0,
        technical_limitations: 2,
        stimulation: 2,
        standards: 2
      },
      development: {
        time: 4,
        competency: 3
      },
      implementation: {
        involvement: 1
      }
    }
  },
  video: {
    label: "Video",
    values: {
      openness: {
        materials: 2,
        retrievable: 1,
        tools: 1,
        format: 2
      },
      availability: {
        rigidity: 0,
        technical_limitations: 2,
        stimulation: 2,
        standards: 2
      },
      development: {
        time: 4,
        competency: 4
      },
      implementation: {
        involvement: 2
      }
    }
  },
  multimedia: {
    label: "Multimedia",
    values: {
      openness: {
        materials: 2,
        retrievable: 3,
        tools: 1,
        format: 1
      },
      availability: {
        rigidity: 1,
        technical_limitations: 2,
        stimulation: 1,
        standards: 2
      },
      development: {
        time: 4,
        competency: 4
      },
      implementation: {
        involvement: 2
      }
    }
  },
  ecourse: {
    label: {
      en: "eCourse",
      nb: "eKurs"
    },
    values: {
      openness: {
        materials: 1,
        retrievable: 3,
        tools: 0,
        format: 1
      },
      availability: {
        rigidity: 2,
        technical_limitations: 2,
        stimulation: 1,
        standards: 1
      },
      development: {
        time: 5,
        competency: 5
      },
      implementation: {
        involvement: 2
      }
    }
  },
  ecourses: {
    label: {
      en: "Associated eCourses",
      nb: "Tilknyttede eKurs"
    },
    values: {
      openness: {
        materials: 1,
        retrievable: 3,
        tools: 0,
        format: 1
      },
      availability: {
        rigidity: 2,
        technical_limitations: 2,
        stimulation: 1,
        standards: 1
      },
      development: {
        time: 5,
        competency: 5
      },
      implementation: {
        involvement: 3
      }
    }
  }
};

var lang;
window.addEventListener(
  "load",
  function(event) {
    if (
      findGetParameter("lang") &&
      findGetParameter("lang") != "" &&
      findGetParameter("lang") in labels
    ) {
      lang = findGetParameter("lang");
      labels = labels[lang];
    } else {
      lang = "en";
      labels = labels[lang];
    }
    const chartLabels = [];
    for (var key in labels.factors) {
      if (labels.factors[key].hasOwnProperty("label")) {
        chartLabels.push(labels.factors[key].label);
      }
    }
    console.debug("chart labels", chartLabels);
    console.debug("labels", labels);
    console.debug("data", data);
    const normalizedData = normalizeData(data, labels.factors);
    console.debug("normalizedData", normalizedData);
    const averagedData = averageDataCategories(normalizedData);
    console.debug("averagedData", averagedData);
    const datasets = assembleDatasets(lang, averagedData);
    console.debug("datasets", datasets);

    let table = buildTable("table", labels.factors);
    let tableBody = table.createTBody();
    fillTable(lang, tableBody, data, normalizedData, averagedData, labels);

    tippy("[data-tippy-content]", {
      trigger: "mouseenter focus click"
    });

    new Chart(ctx, {
      type: "radar",
      data: {
        labels: chartLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRadio: true,
        aspectRatio: 1,
        legend: {
          position: "top"
        },
        title: {
          display: false,
          text: "Vurdering av læringsobjekter",
          fontSize: 32
        },
        scale: {
          reverse: false,
          ticks: {
            max: 110,
            min: 0,
            beginAtZero: true
          },
          pointLabels: {
            fontSize: 16
          }
        },
        plugins: {
          colorschemes: {
            fillAlpha: 0.15,
            scheme: "brewer.Paired12"
          }
        }
      }
    });
    if (findGetParameter("readme")) {
      console.log(generateReadme(labels));
    }
  },
  false
);
