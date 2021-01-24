class VectorMath {
    getDistance(point1, point2) {
        return Math.sqrt(
            Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
        )
    }

    sortByDistance(point1, allPoints) {
        allPoints.sort((a, b) => (this.getDistance(point1, a) > this.getDistance(point1, b)) ? 1 : -1)
        return allPoints
    }

    special_vectorSelect_sortByDistance(point1, allPoints) {
        const sort = [...allPoints]

        sort.sort((a, b) => (this.getDistance(point1, a.pos) > this.getDistance(point1, b.pos)) ? 1 : -1)
        return sort
    }

    getMiddle(point1, point2) {
        return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]
    }

    switchXY(points) {
        return points.map(p => [p[1], p[0]])
    }
}

export default new VectorMath()