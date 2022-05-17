# Find solar terms to a given date.
# Adopted from https://stackoverflow.com/questions/55838712/finding-equinox-and-solstice-times-with-astropy

import math
from astropy.time import Time, TimeDelta
import astropy.coordinates
from scipy.optimize import brentq
from astropy import units as u
import numpy as np

def sunEclipticLongitude(t):
    "Return ecliptic longitude of the sun in degrees at given time (MJD)"

    sun = astropy.coordinates.get_body('sun', t)
    eclipticOfDate = astropy.coordinates.GeocentricTrueEcliptic(equinox=t)
    sunEcliptic = sun.transform_to(eclipticOfDate)
    return sunEcliptic.lon.deg


def linearize2(angle):
    """Map angle values in degrees near the quadrants of the circle
    into smooth functions crossing zero, for root-finding algorithms.
    Note that for angles near 90 or 270, increasing angles yield decreasing results
    >>> linearize2(5) > 0 > linearize2(355)
    True
    >>> linearize2(95) < 0 < linearize2(85)
    False
    """

    # There are 2 roots for each complete circle
    # We need 24 roots for all the solar terms
    return math.sin(math.radians(angle * 12))

def map_syzygy(delta, t0):
    "Map times into linear functions crossing zero at each syzygy"

    t = t0 + TimeDelta(delta * u.day)
    return linearize2(sunEclipticLongitude(t))


def find_nearest_syzygy(t0):
    """Return the precise Time of the nearest solar term to the given Time
    """

    delta = 365.25 / 24

    result = brentq(map_syzygy, 0, delta, args=(t0, ))
    return t0 + TimeDelta(result * u.day)

if __name__ == '__main__':
    import doctest
    doctest.testmod()

    results = {}

    with open("solarterm-data.csv", "a") as f:
        for year in range(1908, 2050):
            t0 = Time(f'{year}-01-01T00:00:00', format='isot', scale='utc')
            r = []
            for i in range(24):
                try:
                    syzygy = find_nearest_syzygy(t0)
                except ValueError as e:
                    print(f'{e=}, {t0=}')
                    continue
                print(f'Term {i=}, {syzygy.value=}, {sunEclipticLongitude(syzygy)=}')
                t0 = syzygy + 365.25 / 24 - 365.25 / 48
                r.append(syzygy.value)
            print(f"{year}: " + ",".join(r), file=f)
            f.flush()
